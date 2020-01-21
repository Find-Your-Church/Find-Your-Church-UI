import React, {Component} from "react";
import {Link} from "react-router-dom";
import '../css/dashboard.css';
import '../css/account.css';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {updateUserInfo} from "../../actions/auth-actions";
import SiteFooter from "../../components/site-footer";

class Account extends Component{
	constructor(props){
		super(props);

		let {user} = props.auth;

		this.state = {
			showedInvoice: false,
			editingUserName: false,
			editingPassword: false,
			editingRefCode: false,
			editingBillingCard: false,
			editingBillingZipCode: false,
			errors: {},

			user_email: user.email,
			user_fname: user.fname,
			user_lname: user.lname,
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
		this.changeRefCode = this.changeRefCode.bind(this);
		this.changeBillingCard = this.changeBillingCard.bind(this);
		this.changeBillingZipCode = this.changeBillingZipCode.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.errors){
			this.setState({
				errors: nextProps.errors
			});
		}
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

	componentDidUpdate(prevProps, prevState, snapshot){
		//console.log("After updated: ", this.props.auth.user);
	}

	render(){
		return (
			<div>
				<main className="account-body">
					<div className="div-20top _1080">
						<div className="div-20bottom">
							<div className="container-inline">
								<div className="flexdiv-leftright underline">
									<div className="flexdiv-left">
										<h5 className="container-header">User Information</h5>
										<img src="/img/tooltip-icon.png"
											 alt="" className="tooltip-icon"/>
									</div>
								</div>
								<div>
									<div>
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
											<h4 className="table-item" title="The email address cannot be changed.">
												{this.state.user_email}
												{this.state.errors.msg_email !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_email}
													</div>
													: null}
											</h4>
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
												<img src="/img/tooltip-icon.png"
													 alt="" className="tooltip-icon"/>
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
							<div className="container-inline">
								<div className="flexdiv-leftright underline">
									<div className="flexdiv-left">
										<h5 className="container-header">Plan Summary</h5>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
								</div>
								<div>
									<div className="table-row">
										<div id="w-node-0b93d4360cca-27fc25a8" className="flexdiv-left">
											<h4 className="table-header">Published Profiles</h4>
											<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
										</div>
										<h4 className="table-item">05</h4>
									</div>
									<div className="table-row">
										<div id="w-node-0b93d4360cd1-27fc25a8" className="flexdiv-left">
											<h4 className="table-header">Next Payment</h4>
											<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
										</div>
										<h4 className="table-item">$46.54 on 01/05/2020</h4>
										<Link
											id="w-node-0b93d4360cd7-27fc25a8"
											data-w-id="31fd1b03-8aea-c202-539b-0b93d4360cd7"
											to="#" className="table-link" onClick={this.toggleInvoice}>Show
											Invoice</Link>
									</div>
								</div>
								<div data-w-id="cc800809-ec2d-e69c-64b8-a9699911c77d"
									 style={{height: this.state.showedInvoice ? "auto" : "0px"}}
									 className="accordion-div">
									<div className="div-20top">
										<div>
											<div className="flexdiv-leftright underline">
												<div className="flexdiv-left">
													<h5 className="container-header">Upcoming Invoice</h5>
												</div>
											</div>
											<div>
												<div className="invoice-row">
													<div className="flexdiv-left">
														<h4 className="table-header">Active Communities</h4>
														<img src="/img/tooltip-icon.png" alt=""
															 className="tooltip-icon"/>
													</div>
													<h4 className="invoice-item">05</h4>
												</div>
												<div className="invoice-row">
													<div className="flexdiv-left">
														<h4 className="table-header">Price Per Community</h4>
														<img src="/img/tooltip-icon.png" alt=""
															 className="tooltip-icon"/>
													</div>
													<h4 className="invoice-item">$8.98</h4>
												</div>
												<div className="invoice-row">
													<div className="flexdiv-left">
														<h4 className="table-header">Subtotal</h4>
														<img src="/img/tooltip-icon.png" alt=""
															 className="tooltip-icon"/>
													</div>
													<h4 className="invoice-item">$44.90</h4>
												</div>
												<div className="invoice-row">
													<div className="flexdiv-left">
														<h4 className="table-header">Taxes and Fees</h4>
														<img src="/img/tooltip-icon.png" alt=""
															 className="tooltip-icon"/>
													</div>
													<h4 className="invoice-item">$1.64</h4>
												</div>
												<div className="invoice-row">
													<div className="flexdiv-left">
														<h4 className="table-header">Total due on 01/05/2020</h4>
														<img src="/img/tooltip-icon.png" alt=""
															 className="tooltip-icon"/>
													</div>
													<h4 className="invoice-item">$46.54</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="div-20bottom">
							<div className="container-inline">
								<div className="flexdiv-leftright underline">
									<div className="flexdiv-left">
										<h5 className="container-header">Billing Information</h5>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
								</div>
								<div>
									<div>
										<div className="table-row">
											<h4 className="table-header">Name</h4>
											<h4 className="table-item">{this.state.user_fname}&nbsp;{this.state.user_lname}</h4>
										</div>
										<div className="table-row">
											<h4 className="table-header">Card</h4>
											<h4 className="table-item">
												{this.state.editingBillingCard ?
													<div className="w3-row">
														<input type="text" className="w3-col"
															   title="Billing card" placeholder="**** **** **** 1234"
															   id="user_billing_card" onChange={this.onChange}
															   value={this.state.user_billing_card} autoFocus/>
													</div>
													: this.state.user_billing_card
												}
												{this.state.errors.msg_billing_card !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_billing_card}
													</div>
													: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeBillingCard}>
												{this.state.editingBillingCard ? "Save" : "Update"}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">Billing Zip Code</h4>
											<h4 className="table-item">
												{this.state.editingBillingZipCode ?
													<div className="w3-row">
														<input type="text" className="w3-col"
															   title="Billing ZIP code" placeholder="12345"
															   id="user_billing_zip_code" onChange={this.onChange}
															   value={this.state.user_billing_zip_code} autoFocus/>
													</div>
													: this.state.user_billing_zip_code
												}
												{this.state.errors.msg_billing_zip_code !== undefined ?
													<div className="error-item">
														{this.state.errors.msg_billing_zip_code}
													</div>
													: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeBillingZipCode}>
												{this.state.editingBillingZipCode ? "Save" : "Update"}
											</Link>
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
	errors: PropTypes.object.isRequired,
	updateUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{updateUserInfo}
)(Account);
