import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {updateUserInfo} from "../../actions/auth-actions";
import SiteFooter from "../../components/site-footer";
import '../../css/account.css';
import {getBillingStatus, registerCard} from "../../actions/community-actions";
import {CardElement, injectStripe} from "react-stripe-elements";
import "../../css/stripe-style.css";

const cardStyle = {
	base: {
		color: "#32325d",
		"::placeholder": {
			color: "#aab7c4"
		}
	},
	invalid: {
		color: "#fa755a",
		iconColor: "#fa755a"
	}
};

class Account extends Component{
	constructor(props){
		super(props);

		let {user} = props.auth;

		this.props.getBillingStatus({
			email: this.props.auth.user.email,
		}, this.props.history);

		this.state = {
			showedInvoice: false,
			editingUserName: false,
			editingPassword: false,
			editingPhone: false,
			editingRefCode: false,
			editingBillingCard: false,
			editingBillingZipCode: false,
			editing_card: false,
			errors: {},

			user_email: user.email,
			user_email_verified: user.email_verified,
			user_email_verified_at: user.email_verified_at,
			user_fname: user.fname,
			user_lname: user.lname,
			user_phone: user.phone,
			user_registered_at: user.registered_at,
			user_password: "",
			user_password2: "",
			user_p_len: user.p_len,
			user_ref_code: user.ref_code === undefined ? "" : user.ref_code,
			user_billing_card: user.billing_card === undefined ? "" : user.billing_card,
			user_billing_zip_code: user.billing_zip_code === undefined ? "" : user.billing_zip_code,
		};

		this.toggleInvoice = this.toggleInvoice.bind(this);
		this.changeUserName = this.changeUserName.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.changePhone = this.changePhone.bind(this);
		this.changeRefCode = this.changeRefCode.bind(this);
		this.changeBillingCard = this.changeBillingCard.bind(this);
		this.changeBillingZipCode = this.changeBillingZipCode.bind(this);
		this.clickEditCard = this.clickEditCard.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	toggleInvoice(){
		this.setState({showedInvoice: !this.state.showedInvoice});
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	changeUserName(){
		// if editing, save the username via axios to BE API.
		if(this.state.editingUserName){
			const userData = {
				email: this.state.user_email,
				fname: this.state.user_fname,
				lname: this.state.user_lname,
			};
			this.props.updateUserInfo(userData, this.props.history);
		}

		// anyway switch display method.
		this.setState({editingUserName: !this.state.editingUserName});
	}

	changePassword(){
		if(this.state.editingPassword){
			const userData = {
				email: this.state.user_email,
				password: this.state.user_password,
				password2: this.state.user_password2,
			};
			this.props.updateUserInfo(userData, this.props.history);
		}

		// anyway switch display method.
		this.setState({editingPassword: !this.state.editingPassword, user_password: "", user_password2: ""});
	}

	changeRefCode(){
		// if editing, save the referral code via axios to BE database.
		if(this.state.editingRefCode){
			const userData = {
				email: this.state.user_email,
				ref_code: this.state.user_ref_code,
			};
			this.props.updateUserInfo(userData, this.props.history);
		}

		// anyway switch display method.
		this.setState({editingRefCode: !this.state.editingRefCode});
	}

	changePhone(){
		// if editing, save the referral code via axios to BE database.
		if(this.state.editingPhone){
			const userData = {
				email: this.state.user_email,
				phone: this.state.user_phone,
			};
			this.props.updateUserInfo(userData, this.props.history);
		}

		// anyway switch display method.
		this.setState({editingPhone: !this.state.editingPhone});
	}

	changeBillingCard(){
		// if editing, save the billing card via axios to BE database.
		if(this.state.editingBillingCard){
			const userData = {
				email: this.state.user_email,
				billing_card: this.state.user_billing_card,
			};
			this.props.updateUserInfo(userData, this.props.history);
		}

		// anyway switch display method.
		this.setState({editingBillingCard: !this.state.editingBillingCard});
	}

	changeBillingZipCode(){
		// if editing, save the billing zip code via axios to BE database.
		if(this.state.editingBillingZipCode){
			const userData = {
				email: this.state.user_email,
				billing_zip_code: this.state.user_billing_zip_code,
			};
			this.props.updateUserInfo(userData, this.props.history);
		}

		// anyway switch display method.
		this.setState({editingBillingZipCode: !this.state.editingBillingZipCode});
	}

	showAmount(cents){
		return (cents / 100).toLocaleString('en-US', {
			style: 'currency', currency: 'USD'
		});
	}

	getNextMonth(current, delta){
		const num_days = new Date(current.getFullYear(), current.getMonth() + delta + 1, 0).getDate();
		return new Date(
			current.getFullYear(), current.getMonth() + delta, current.getDate() > num_days ? num_days : current.getDate(),
			current.getHours(), current.getMinutes(), current.getSeconds(), current.getMilliseconds());
	}

	async clickEditCard(){
		if(this.state.editing_card){
			const full_name = `${this.props.auth.user.fname} ${this.props.auth.user.lname}`;
			const {token} = await this.props.stripe.createToken({name: full_name,});

			/**
			 * register new card.
			 */
			if(token !== undefined){
				this.props.registerCard({
					source: token.id,
					email: this.props.auth.user.email,
					name: full_name,
					description: 'Name: ' + full_name,
				});
			}
		}

		this.setState({editing_card: !this.state.editing_card});
	}

	render(){
		const next_month0 = new Date(
			this.props.community.upcoming_invoice ?
				1000 * parseInt(this.props.community.upcoming_invoice.next_payment_attempt)
				: 0
		);
		const next_month1 = this.getNextMonth(next_month0, 1);
		const next_month2 = this.getNextMonth(next_month0, 2);

		return (
			<div>
				<main className="account-body">
					<div className="div-20top _1080">
						<div className="div-20bottom">
							<div className="container-inline w3-row">
								<div className="flexdiv-leftright panel underline">
									<h5 className="container-header">Account Information</h5>
								</div>
								<div className={"sub-container w3-col m12 l6"}>
									<div className={"sub-content"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">Admin Info</h5>
											<i className={"fas fa-question-circle tooltip-icon w3-right"}> </i>
										</div>
										<div className="table-row">
											<h4 id="w-node-cb8d7881b96b-27fc25a8" className="table-header">Name</h4>
											<h4 id="w-node-cb8d7881b96d-27fc25a8" className="table-item">
												{this.state.editingUserName ?
													<div className="w3-row">
														<input type="text" className="w3-half"
															   title="First name" placeholder="First name"
															   id="user_fname" onChange={this.onChange}
															   value={this.state.user_fname} autoFocus/>
														<input type="text" className="w3-half"
															   title="Last name" placeholder="Last name"
															   id="user_lname" onChange={this.onChange}
															   value={this.state.user_lname}/>
													</div>
													: this.state.user_fname + " " + this.state.user_lname
												}
												{this.state.errors.msg_name !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_name}
													</div>
													: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeUserName}>
												{this.state.editingUserName ? "Save" : "Edit"}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">Email</h4>
											<h4 className="table-item" title={
												this.state.user_email_verified ? "This email was verified." : ""
											}>
												{this.state.user_email}
												{this.state.user_email_verified ? (
													<img src={"/img/icon/icon-verified.svg"} className={"verified-mark"}
														 alt={"verified mark"}
														 title={"Verified at: " + new Date(this.state.user_email_verified_at).toString()}/>
												) : null}
												{this.state.errors.msg_email !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_email}
													</div>
													: null}
											</h4>
										</div>
										<div className="table-row">
											<div id="w-node-cb8d7881b980-27fc25a8" className="flexdiv-left">
												<h4 className="table-header">Phone</h4>
											</div>
											<h4 className="table-item">
												{this.state.editingPhone ?
													<div className="w3-row">
														<input type="text" className="w3-col"
															   title="Phone" placeholder="Phone"
															   id="user_phone" onChange={this.onChange}
															   value={this.state.user_phone} autoFocus/>
													</div>
													: this.state.user_phone
												}
												{this.state.errors.msg_phone !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_phone}
													</div>
													: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changePhone}>
												{this.state.editingPhone ? "Save" : "Change"}
											</Link>
										</div>
									</div>
								</div>
								<div className={"sub-container w3-col m12 l6"}>
									<div className={"sub-content"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">User Info</h5>
											<i className={"fas fa-question-circle tooltip-icon w3-right"}> </i>
										</div>
										<div className="table-row">
											<h4 className="table-header">Password</h4>
											<h4 className="table-item">
												{this.state.editingPassword ?
													<div className="w3-row">
														<input type="password" className="w3-half"
															   title="Password" placeholder="Password"
															   id="user_password" onChange={this.onChange}
															   value={this.state.user_password} autoFocus/>
														<input type="password" className="w3-half"
															   title="Confirm" placeholder="Confirm"
															   id="user_password2" onChange={this.onChange}
															   value={this.state.user_password2}/>
													</div>
													: "*".repeat(16)
												}
												{this.state.errors.msg_password !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_password}
													</div>
													: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changePassword}>
												{this.state.editingPassword ? "Save" : "Change"}
											</Link>
										</div>
										<div className="table-row">
											<div id="w-node-cb8d7881b980-27fc25a8" className="flexdiv-left">
												<h4 className="table-header">Referral Code</h4>
												<i className={"fas fa-question-circle tooltip-icon"}> </i>
											</div>
											<h4 className="table-item">
												{this.state.editingRefCode ?
													<div className="w3-row">
														<input type="text" className="w3-col"
															   title="Referral code" placeholder="Referral code"
															   id="user_ref_code" onChange={this.onChange}
															   value={this.state.user_ref_code} autoFocus/>
													</div>
													: this.state.user_ref_code
												}
												{this.state.errors.msg_ref_code !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_ref_code}
													</div>
													: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeRefCode}>
												{this.state.editingRefCode ? "Save" : "Change"}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">Registration</h4>
											<h4 className="table-item">
												{
													/**
													 * It displays the registered date in the client's locale format.
													 */
													new Date(this.state.user_registered_at).toString()
												}
											</h4>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="div-20bottom">
							<div className="container-inline w3-row">
								<div className="flexdiv-leftright panel underline">
									<h5 className="container-header">Payment Summary</h5>
								</div>
								<div className={"sub-container w3-col m12 l6"}>
									<div className={"sub-content"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">Account Summary</h5>
											<i className={"fas fa-question-circle tooltip-icon w3-right"}> </i>
										</div>
										<div className="table-row-2">
											<div id="w-node-0b93d4360cca-27fc25a8" className="flexdiv-left">
												<h4 className="table-header">Activations</h4>
												<i className={"fas fa-question-circle tooltip-icon"}> </i>
											</div>
											<h4 className="table-item right">
												{this.props.community.subscription ?
													this.props.community.subscription.quantity
													: (this.props.community.is_sending ?
														<i className="fas fa-spinner fa-spin"> </i>
														: "-")}
											</h4>
										</div>
										<div className="table-row-2">
											<div id="w-node-0b93d4360cd1-27fc25a8" className="flexdiv-left">
												<h4 className="table-header">Price</h4>
												<i className={"fas fa-question-circle tooltip-icon"}> </i>
											</div>
											<h4 className="table-item right">
												{this.props.community.subscription ?
													this.showAmount(this.props.community.subscription.plan.amount)
													: (this.props.community.is_sending ?
														<i className="fas fa-spinner fa-spin"> </i>
														: "-")}
											</h4>
										</div>
									</div>
								</div>
								<div>
									<div className={"sub-container w3-col m12 l6"}>
										<div className={"sub-content"}>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">Payment Summary</h5>
												<i className={"fas fa-question-circle tooltip-icon w3-right"}> </i>
											</div>
											<div className="table-row-2">
												<h4 className="table-header">Subtotal</h4>
												<h4 className="table-item right">
													{this.props.community.subscription ?
														this.showAmount(this.props.community.subscription.plan.amount)
														: (this.props.community.is_sending ?
															<i className="fas fa-spinner fa-spin"> </i>
															: "-")}
												</h4>
											</div>
											<div className="table-row-2">
												<h4 className="table-header">Taxes and Fees</h4>
												<h4 className="table-item right">
													{this.props.community.last_invoice ?
														this.showAmount(this.props.community.last_invoice.tax)
														: "-"}
												</h4>
											</div>
											<div className="table-row-2">
												<h4 className="table-header">Due Today</h4>
												<h4 className="table-item right">
													<div style={{textDecoration: "line-through"}}>
														{this.props.community.subscription ?
															this.showAmount(this.props.community.subscription.plan.amount
																+ (this.props.community.last_invoice ?
																	this.props.community.last_invoice.tax / 100 : 0))
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
													</div>
													<div className={"w3-text-green"}>
														{this.props.community.last_invoice ?
															this.showAmount(this.props.community.last_invoice.subtotal)
															: "-"}
													</div>
												</h4>
											</div>
											<div className="table-row-2">
												<h4 className="table-header">Upcoming Billing</h4>
												<h4 className="table-item right">
													<div>
														{this.props.community.upcoming_invoice ?
															this.showAmount(this.props.community.upcoming_invoice.total)
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
														&nbsp;on&nbsp;
														{this.props.community.upcoming_invoice ?
															next_month0.toLocaleDateString()
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
													</div>
													<div>
														{this.props.community.upcoming_invoice ?
															this.showAmount(this.props.community.upcoming_invoice.total)
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
														&nbsp;on&nbsp;
														{this.props.community.upcoming_invoice ?
															next_month1.toLocaleDateString()
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
													</div>
													<div>
														{this.props.community.upcoming_invoice ?
															this.showAmount(this.props.community.upcoming_invoice.total)
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
														&nbsp;on&nbsp;
														{this.props.community.upcoming_invoice ?
															next_month2.toLocaleDateString()
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
													</div>
												</h4>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="div-20bottom">
								<div className="container-inline w3-row">
									<div className="flexdiv-leftright panel underline">
										<h5 className="container-header">Billing Information</h5>
									</div>
									<div className={"sub-container w3-col m12 l6"}>
										<div className={"sub-content"}>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">Payment Information</h5>
												<Link to="#" className={"w3-text-indigo w3-hover-text-blue"}
													  onClick={this.clickEditCard}>
													{this.state.editing_card ? "Apply" : "Update"}
												</Link>
											</div>
											<div className="form-row">
												<div className={"pay-info-row"}>
															<span className={"w3-text-dark-grey"}>
																{this.props.auth.user.fname} {this.props.auth.user.lname}
															</span>
												</div>
											</div>
											{this.state.editing_card ?
												<div className="form-row">
													<CardElement className="CardInfoStyle" style={cardStyle}/>
												</div>
												: null}
											{this.props.community.is_setting_card ? (
												<div className={"w3-container w3-center w3-margin-top"}>
													<i className="fas fa-spinner fa-spin"> </i>
												</div>
											) : (
												this.props.community.customer ? (
													<div className={"card-detail"}>
														<div className={"card-detail-item w3-row"}>
															<div className={"w3-col l4"}>
																Card number
															</div>
															<div className={"w3-col l8"}>
																**** **** ****&nbsp;
																{this.props.community.customer.sources.data[0].last4}
															</div>
														</div>
														<div className={"card-detail-item w3-row"}>
															<div className={"w3-col l4"}>
																Expiry
															</div>
															<div className={"w3-col l8"}>
																{this.props.community.customer.sources.data[0].exp_month}/{this.props.community.customer.sources.data[0].exp_year}
															</div>
														</div>
														<div className={"card-detail-item w3-row"}>
															<div className={"w3-col l4"}>
																CVC
															</div>
															<div className={"w3-col l8"}>
																{this.props.community.customer.sources.data[0].cvc_check}
															</div>
														</div>
														<div className={"card-detail-item w3-row"}>
															<div className={"w3-col l4"}>
																Zip Code
															</div>
															<div className={"w3-col l8"}>
																{this.props.community.customer.sources.data[0].address_zip}
															</div>
														</div>
													</div>
												) : (
													<div className="w3-margin-top w3-text-grey w3-center">
														No billing card.
													</div>
												)
											)}
											<div className="w-form-done">
												<div>Thank you! Your submission has been received!</div>
											</div>
											<div className="w-form-fail">
												<div>Oops! Something went wrong while submitting the form.</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
				<SiteFooter/>
			</div>
		);
	}
}

Account.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	updateUserInfo: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
	registerCard: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{registerCard, updateUserInfo, getBillingStatus}
)(injectStripe(Account));
