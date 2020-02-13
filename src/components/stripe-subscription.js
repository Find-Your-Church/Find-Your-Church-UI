import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {CardElement, injectStripe} from "react-stripe-elements";
import {
	getBillingStatus,
	registerCard,
	clearLastInvoice,
	activateCommunity,
	hideActivateDlg, verifyCoupon, clearCouponVerified, clearCouponFailed, clearActiveStatus, getPlan
} from "../actions/community-actions";
import getNextMonth from "../utils/getNextMonth";
import "../css/stripe-subscription.css";
import "../css/stripe-style.css";
import formatNumber from "../utils/formatNumber";
import showAmount from "../utils/showAmount";
import Popup from "reactjs-popup";

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

class StripeSubscription extends Component{
	constructor(props){
		super(props);

		const name_on_card = (this.props.auth.user.billing_info ? this.props.auth.user.billing_info.sources.data[0].name : "").split(" ");
		this.state = {
			errors: {},

			coupon: '',

			editing_card: false,
			fname_on_card: name_on_card[0],
			lname_on_card: name_on_card[1] === undefined ? "" : name_on_card[1],
		};

		this.verifyCoupon = this.verifyCoupon.bind(this);
		this.clickEditCard = this.clickEditCard.bind(this);
		this.hideActivationDialog = this.hideActivationDialog.bind(this);
		this.handleActivateCommunity = this.handleActivateCommunity.bind(this);
	}

	componentDidMount(){
		this.props.clearActiveStatus();
		this.props.clearCouponVerified();
		this.props.clearCouponFailed();
		this.props.getBillingStatus({
			user_id: this.props.auth.user.id,
		}, this.props.history);
		this.props.getPlan();
	}

	onChange = e => {
		if(e.target.id === 'coupon'){
			this.props.clearCouponVerified();
			this.props.clearCouponFailed();
		}
		this.setState({[e.target.id]: e.target.value});
	};

	verifyCoupon(){
		this.props.verifyCoupon({
			code: this.state.coupon,
		});
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	hideActivationDialog(){
		this.props.hideActivateDlg();
	}

	async clickEditCard(){
		if(this.state.editing_card){
			const full_name = `${this.state.fname_on_card} ${this.state.lname_on_card}`;
			const {token} = await this.props.stripe.createToken({name: full_name,});

			/**
			 * register new card.
			 */
			if(token !== undefined){
				this.props.registerCard({
					id: this.props.auth.user.id,
					source: token.id,
					email: this.props.auth.user.email,
					name: full_name,
					description: 'Holder: ' + full_name,
				});
			}
		}
		else{
			const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;
			const name_on_card = (customer ? customer.sources.data[0].name : "").split(" ");
			this.setState({
				fname_on_card: name_on_card[0],
				lname_on_card: name_on_card[1] === undefined ? "" : name_on_card[1],
			});
		}

		this.setState({editing_card: !this.state.editing_card});
	}

	cancelEditCard = () => {
		this.setState({editing_card: false});
	};

	async handleActivateCommunity(e){
		if(this.props.stripe){
			if(!this.props.second){
				const full_name = `${this.state.fname_on_card} ${this.state.lname_on_card}`;
				const {token} = await this.props.stripe.createToken({name: full_name,});

				/**
				 * register new card.
				 */
				if(token !== undefined){
					this.props.activateCommunity({
						source: token.id,
						email: this.props.auth.user.email,
						name: full_name,
						description: 'Holder: ' + full_name,
						community_id: this.props.community.community_activated,
						id: this.props.auth.user.id,
						coupon: this.props.community.coupon_verified ? this.state.coupon : null,
					});
				}
			}
			else{
				// check the customer information
				if(this.props.auth.user.billing_info){
					// activate this community as existed stripe customer.
					this.props.activateCommunity({
						community_id: this.props.community.community_activated,
						source: null,
						id: this.props.auth.user.id,
						coupon: this.props.community.coupon_verified ? this.state.coupon : null,
					});
				}
			}
		}
		else{
			console.log("Stripe object was not initialized.")
		}
	}

	/**
	 * this.props.community.subscription ? <- 2nd, or 1st.
	 * @returns {*}
	 */
	render(){
		let next_due_date = "", next_month1 = "", next_month2 = "";
		const to_date = new Date();
		if(this.props.community.subscription){
			let i;
			const init_date = new Date(this.props.community.subscription.billing_cycle_anchor * 1000);
			next_due_date = init_date;
			i = 1;
			const to_date_time = to_date.getTime();
			while(next_due_date.getTime() < to_date_time){
				next_due_date = getNextMonth(init_date, i);
				i++;
			}
			next_month1 = getNextMonth(init_date, i);
			next_month2 = getNextMonth(init_date, i + 1);
		}

		const due_amount = this.props.community.subscription ?
			showAmount((this.props.community.my_communities.active.length + 1) * this.props.community.plan_price)
			: showAmount(this.props.community.plan_price);

		const upcoming_duedate = new Date(to_date.getFullYear(), to_date.getMonth(), to_date.getDate() + this.props.community.trial_period_days).toLocaleDateString('en-US');

		const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;

		return (
			<div className="subscriptioncontainer-div w3-modal-content w3-card-4 w3-animate-zoom">
				<div className="header1-div gradient shadow">
					<h3 className="header3 center">
						{this.props.second ?
							"Add More Activations"
							: "Activate Your Community"}
					</h3>
				</div>
				<div className="container-div1">
					<div className="columns-container">
						<div>
							<div className="div-block-147">
								<div className="accordionheader-div nounderline">
									<h3>Account Summary</h3>
									<Popup
										trigger={<i style={{cursor: "pointer"}}
													className={"fas fa-question-circle tooltip-icon"}> </i>}
										position={"left top"}>
										<div>Tell visitors more about your community...</div>
									</Popup>
								</div>
								<div className="subscribe-container">
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4 className="table-header">Activations</h4>
												<Popup
													trigger={<i style={{cursor: "pointer"}}
																className={"fas fa-question-circle tooltip-icon"}> </i>}
													position={"right center"}>
													<div>Tell visitors more about your community...</div>
												</Popup>
											</div>
											<div>
												<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}
													title={"Communities activated / Paid activations"}>
													{formatNumber(this.props.community.my_communities.active.length)}
													&nbsp;/&nbsp;
													{this.props.community.subscription ?
														formatNumber(this.props.community.subscription.quantity + this.props.community.tickets)
														: (this.props.community.is_sending ?
															<i className="fas fa-spinner fa-spin"> </i>
															: "00")}
												</h4>
											</div>
										</div>
									</div>
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4 className="table-header">Price</h4>
												<Popup
													trigger={<i style={{cursor: "pointer"}}
																className={"fas fa-question-circle tooltip-icon"}> </i>}
													position={"right center"}>
													<div>Tell visitors more about your community...</div>
												</Popup>
											</div>
											<div>
												<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}>
													{this.props.community.subscription ?
														showAmount(this.props.community.subscription.plan.amount)
														: (this.props.community.is_sending ?
															<i className="fas fa-spinner fa-spin"> </i>
															: "$0.00")}
												</h4>
											</div>
										</div>
									</div>
									{this.props.second || this.props.community.is_sending ? null :
										<div className="invoice-row">
											<div className="invoice-div">
												<div className="filtersheader-div">
													<h4 className="table-header">Discount code</h4>
												</div>
												<input type="text"
													   className="w3-half w3-border-bottom w3-hover-border-blue w3-center w3-normal"
													   style={{
														   border: "none",
														   backgroundImage: this.props.community.coupon_verified ? "url(/img/icon/icon-verified.svg)" : (
															   this.props.community.coupon_failed ? "url(/img/icon/icon-warning.svg)" : "none"
														   )
													   }}
													   title={this.props.community.coupon_verified ? "Discount code verified" : (this.props.community.coupon_failed ? "Invalid discount code" : "")}
													   placeholder="Enter discount code here"
													   id="coupon" onChange={this.onChange}
													   value={this.state.coupon} autoFocus/>
												<button onClick={this.verifyCoupon}
														className={"w3-button w3-padding-small apply-button"}>
													Apply
												</button>
											</div>
										</div>
									}
								</div>
							</div>
							<div className="div-20top">
								<div className="div-block-147">
									<div className="accordionheader-div nounderline">
										<h3>Billing Summary</h3>
										<Popup
											trigger={<i style={{cursor: "pointer"}}
														className={"fas fa-question-circle tooltip-icon"}> </i>}
											position={"left top"}>
											<div>Tell visitors more about your community...</div>
										</Popup>
									</div>
									<div className="subscribe-container">
										<div className="invoice-row">
											<div className="invoice-div">
												<div>
													<div className="filtersheader-div">
														<h4
															className="table-header">Subtotal</h4>
													</div>
												</div>
												<div>
													<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}>
														{this.props.community.subscription ?
															showAmount(this.props.community.subscription.quantity * this.props.community.subscription.plan.amount)
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "$0.00")}
													</h4>
												</div>
											</div>
										</div>
										{this.props.community.subscription !== "1" ? null :
											<div className="invoice-row">
												<div className="invoice-div">
													<div className="filtersheader-div">
														<h4 className="table-header">Taxes and Fees</h4>
													</div>
													<div>
														<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}>
															{this.props.community.last_invoice ?
																showAmount(this.props.community.last_invoice.tax)
																: "$0.00"}
														</h4>
													</div>
												</div>
											</div>
										}
										<div className="invoice-row">
											<div className="invoice-div top">
												<div className="filtersheader-div">
													<h4 className="table-header">Due Today</h4>
													{this.props.community.subscription ? (this.props.community.trialing ? (
															<h4 className={"w3-small w3-text-green"}
																style={{marginLeft: "-70px"}}>
																<br/>
																Free trial
																through {new Date(this.props.community.subscription.trial_end * 1000).toLocaleDateString('en-US')}
															</h4>) : null)
														: (
															this.props.community.trial_period_days > 0 ? (
																	<h4 className={"w3-small w3-text-green"}
																		style={{marginLeft: "-70px"}}>
																		<br/>
																		Free trial
																		through {upcoming_duedate}
																	</h4>)
																: null)}
												</div>
												<div>
													<div className="div10-bottom right">
														{this.props.community.trialing || (!this.props.community.subscription && this.props.community.trial_period_days > 0) ? null : (
															<h4 className={"value strikethrough" + (this.props.community.subscription ? "" : " grey")}>
																{this.props.community.subscription ?
																	showAmount(this.props.community.my_communities.active.length *
																		this.props.community.subscription.plan.amount)
																	: (this.props.community.is_sending ?
																		<i className="fas fa-spinner fa-spin"> </i>
																		: "$0.00")}
															</h4>
														)}
														<h4 className="value w3-text-green right">
															{this.props.community.trialing ? "$0.00" : (this.props.community.subscription ?
																showAmount(this.props.community.my_communities.active.length *
																	this.props.community.subscription.plan.amount)
																: "$0.00")}
														</h4>
													</div>
												</div>
											</div>
										</div>
										<div className="invoice-row">
											<div className="invoice-div top">
												<div className="filtersheader-div">
													<h4 className="table-header">
														Upcoming Billing
													</h4>
												</div>
												<div>
													<div className="div10-bottom">
														<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}>
															{due_amount}
															&nbsp;on&nbsp;
															{this.props.community.subscription ?
																next_due_date.toLocaleDateString('en-US')
																: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: upcoming_duedate)}
														</h4>
													</div>
													<div className="div10-bottom">
														<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}>
															{due_amount}
															&nbsp;on&nbsp;
															{this.props.community.subscription ?
																next_month1.toLocaleDateString('en-US')
																: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: upcoming_duedate)}
														</h4>
													</div>
													<div className="div10-bottom">
														<h4 className={"value" + (this.props.community.subscription ? "" : " grey")}>
															{due_amount}
															&nbsp;on&nbsp;
															{this.props.community.subscription ?
																next_month2.toLocaleDateString('en-US')
																: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: upcoming_duedate)}
														</h4>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div className="div-block-147 payiinfo">
								<div className="accordionheader-div">
									<h3>Payment Information</h3>
									{this.props.community.subscription ? (
										<div className={"edit-card"}>
											<Link to="#" className={"table-link"}
												  onClick={this.clickEditCard}>
												{this.state.editing_card ? (
													<i className={"fas fa-save"}> </i>
												) : (
													<i className={"fas fa-pen"}> </i>
												)}
											</Link>
											{this.state.editing_card ? (
												<Link to="#" className={"table-link w3-large"}
													  onClick={this.cancelEditCard}>
													<i className={"fas fa-times"}> </i>
												</Link>
											) : null}
										</div>
									) : null}
								</div>
								<div className="form-block w-form">
									<div className="subscribe-container inputs">
										<div className="form-row">
											<div className={"pay-info-row"}>
												{!this.props.second || this.state.editing_card ? (
													<div className="w3-row">
														<input type="text" className="w3-half"
															   title="First name" placeholder="First name"
															   id="fname_on_card" onChange={this.onChange}
															   value={this.state.fname_on_card} autoFocus/>
														<input type="text" className="w3-half"
															   title="Last name" placeholder="Last name"
															   id="lname_on_card" onChange={this.onChange}
															   value={this.state.lname_on_card}/>
													</div>
												) : (
													<span className={"w3-center grey"}>
														{customer ? customer.sources.data[0].name : "(Card holder name)"}
													</span>
												)}
											</div>
										</div>
										{!this.props.second || this.state.editing_card ? (
											<div className="form-row">
												<CardElement className="CardInfoStyle" style={cardStyle}
															 disabled={!this.state.editing_card && this.props.second}/>
											</div>
										) : (
											this.props.community.is_setting_card ? (
												<div className={"w3-container w3-center w3-margin-top"}>
													<i className="fas fa-spinner fa-spin"> </i>
												</div>
											) : (
												customer ? (
													<div className={"card-detail"}>
														<div className={"card-detail-item w3-row w3-text-grey"}>
															<div className={"w3-col l1"}>
																<img alt={"Payment card"}
																	 src={`/img/card/icon-${customer.sources.data[0].brand.toLowerCase()}.svg`}/>
															</div>
															<div className={"w3-col l4"} title={"Card number"}>
																**** **** ****&nbsp;
																{customer.sources.data[0].last4}
															</div>
															<div className={"w3-col l3"} title={"Expiration"}>
																{customer.sources.data[0].exp_month}/{customer.sources.data[0].exp_year}
															</div>
															<div className={"w3-col l2"}
																 title={customer.sources.data[0].cvc_check}>
																***
															</div>
															<div className={"w3-col l2"}
																 title={`Zip code: ${customer.sources.data[0].address_zip_check}`}>
																{customer.sources.data[0].address_zip}
															</div>
														</div>
													</div>
												) : null
											)
										)}
										<div className="w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="w-form-fail">
											<div>Oops! Something went wrong while submitting the form.</div>
										</div>
									</div>
									{this.props.community.activating || this.props.community.active_status !== 0 ? (
										this.props.community.active_status === 1 ? (
											<div className={"w3-center w3-xlarge w3-text-blue"}>Success!</div>
										) : (this.props.community.active_status === 2 ? (
											<div className={"w3-center w3-xlarge w3-text-red"}>Failed!</div>
										) : null)
									) : (
										<div className="submit-row">
											<button
												onClick={this.state.editing_card ? null : this.handleActivateCommunity}
												className={"form1-submit round w-button" + (this.state.editing_card ? " disabled" : "")}>
												{this.props.community.subscription ?
													"Approve Activation"
													: "Activate Community"}
											</button>
										</div>
									)}
									<div className="div-20top" onClick={this.hideActivationDialog}
										 style={{cursor: 'pointer'}}>
										<p className="fineprint subscription w3-text-blue">Close</p>
									</div>
								</div>
							</div>
							<div className="div-20top">
								<p className="fineprint subscription">
									Payments are processed by <em className="italic-text">Stripe</em> and secured by a
									256-bit SSL&nbsp;encryption.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

StripeSubscription.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	getPlan: PropTypes.func.isRequired,
	verifyCoupon: PropTypes.func.isRequired,
	clearActiveStatus: PropTypes.func.isRequired,
	clearCouponVerified: PropTypes.func.isRequired,
	clearCouponFailed: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
	registerCard: PropTypes.func.isRequired,
	clearLastInvoice: PropTypes.func.isRequired,
	activateCommunity: PropTypes.func.isRequired,
	hideActivateDlg: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{
		getPlan,
		verifyCoupon,
		clearActiveStatus,
		clearCouponVerified,
		clearCouponFailed,
		getBillingStatus,
		registerCard,
		clearLastInvoice,
		activateCommunity,
		hideActivateDlg,
	}
)(injectStripe(StripeSubscription));
