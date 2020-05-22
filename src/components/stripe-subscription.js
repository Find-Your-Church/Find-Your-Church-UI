import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {CardElement, injectStripe} from "react-stripe-elements";
import {
	getBillingStatus,
	registerCard,
	clearLastInvoice,
	hideActivateDlg,
	verifyCoupon,
	clearCouponVerified,
	clearCouponFailed,
	clearActiveStatus,
	getPlan,
	activateMultiCommunity
} from "../actions/community-actions";
import getNextMonth from "../utils/getNextMonth";
import "../css/stripe-subscription.css";
import "../css/stripe-style.css";
import showAmount from "../utils/showAmount";
import Popup from "reactjs-popup";
import terms_conditions from "../terms-conditions";

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

		this.state = {
			errors: {},

			coupon: '',

			editing_card: false,
			name_on_card: this.props.auth.user.billing_info ? this.props.auth.user.billing_info.sources.data[0].name : "",

			showedModal: false,

			accordion_collapsed1: true,
			accordion_collapsed2: true,
			accordion_collapsed3: true,
			accordion_collapsed4: true,
			accordion_collapsed5: true,
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
			const {token} = await this.props.stripe.createToken({name: this.state.name_on_card,});

			/**
			 * register new card.
			 */
			if(token !== undefined){
				this.props.registerCard({
					id: this.props.auth.user.id,
					source: token.id,
					email: this.props.auth.user.email,
					name: this.state.name_on_card,
					description: 'Holder: ' + this.state.name_on_card,
				});
			}
		}
		else{
			const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;
			this.setState({
				name_on_card: customer.sources.data[0].name,
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
				const {token} = await this.props.stripe.createToken({name: this.state.name_on_card,});

				/**
				 * register new card.
				 */
				if(token !== undefined){
					this.props.activateMultiCommunity({
						source: token.id,
						email: this.props.auth.user.email,
						name: this.state.name_on_card,
						description: 'Holder: ' + this.state.name_on_card,
						community_ids: this.props.community.communities_activated,
						id: this.props.auth.user.id,
						coupon: this.props.community.coupon_verified ? this.state.coupon : null,
					});
				}
			}
			else{
				// check the customer information
				if(this.props.auth.user.billing_info){
					// activate this community as existed stripe customer.
					this.props.activateMultiCommunity({
						community_ids: this.props.community.communities_activated,
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

	getDateDiff(prev, next){
		return (next.getTime() - prev.getTime()) / 86400000; // i day in milliseconds
	}

	showModal = () => {
		this.setState({showedModal: true})
	};

	hideModal = () => {
		this.setState({showedModal: false})
	};

	/**
	 * this.props.community.subscription ? <- 2nd, or 1st.
	 * @returns {*}
	 */
	render(){
		let prev_due_date = "", next_due_date = "", next_month1 = "", next_month2 = "";
		const to_date = new Date();
		let due_duration = 1, due_reminder = 0, prorated = 1;
		if(this.props.community.subscription){
			let i;
			const init_date = new Date(this.props.community.subscription.billing_cycle_anchor * 1000);
			next_due_date = init_date;
			prev_due_date = init_date;
			i = 1;
			const to_date_time = to_date.getTime();
			while(next_due_date.getTime() < to_date_time){
				prev_due_date = next_due_date;
				next_due_date = getNextMonth(init_date, i);
				i++;
			}
			next_month1 = getNextMonth(init_date, i);
			next_month2 = getNextMonth(init_date, i + 1);

			due_duration = this.getDateDiff(prev_due_date, next_due_date);
			if(due_duration === 0){
				due_duration = 30;
			}
			due_reminder = this.getDateDiff(to_date, next_due_date);
			prorated = due_reminder / due_duration;

			console.log(init_date, due_reminder, due_duration);
		}

		const due_amount = this.props.community.subscription ?
			showAmount((this.props.community.my_communities.active.length + this.props.community.communities_activated.length) * this.props.community.plan_price)
			: showAmount(this.props.community.communities_activated.length * this.props.community.plan_price);

		const upcoming_duedate = new Date(to_date.getFullYear(), to_date.getMonth(), to_date.getDate() + this.props.community.trial_period_days);
		const upcoming_duedate1 = getNextMonth(upcoming_duedate, 1);
		const upcoming_duedate2 = getNextMonth(upcoming_duedate, 2);

		const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;

		const subscription_price = this.props.community.subscription ?
			showAmount(this.props.community.subscription.plan.amount)
			: (this.props.community.is_sending ? (
				<i className="fas fa-spinner fa-spin"/>
			) : showAmount(this.props.community.plan_price));

		return (
			<>
				<div className={"w3-modal modal-terms-conditions"}
						 style={{display: this.state.showedModal ? "block" : "none"}}>
					<div className={"w3-modal-content w3-card-4 w3-animate-zoom"}>
						<header className={"w3-container w3-border-bottom"}>
							<span onClick={this.hideModal} className={"w3-button w3-xxlarge w3-display-topright"}>&times;</span>
							<div className={"terms-title"}>Terms and Conditions</div>
						</header>
						<div className={"w3-container terms-conditions-content"}
								 dangerouslySetInnerHTML={{__html: terms_conditions}}>
						</div>
					</div>
				</div>
				<div className="activate-dlg-close" onClick={this.hideActivationDialog}>
					&times;
				</div>
				<div className="subscriptioncontainer-div w3-modal-content w3-card-4 w3-animate-zoom">
					<div className="header1-div gradient shadow">
						<h3 className="header3 center">
							{this.props.second ?
								"Help more people find your community."
								: "Help more people find your community."}
						</h3>
					</div>
					<div className="container-div1">
						<div className="div-block-147">
							<div className="accordionheader-div nounderline">
								<h3>Account Summary:</h3>
								<Popup
									trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
									position={"left top"}>
									<div>
										This is a summary showing you how many communities you have active out of the total amount you've
										paid for this billing cycle; as well as the quantity and price of the additional activations you're
										approving.
									</div>
								</Popup>
							</div>
							<div className="subscribe-container">
								<div className="invoice-div">
									<div className="filtersheader-div">
										<h4 className="table-header">Active / Paid</h4>
									</div>
									<div>
										<h4 className={"value" + (this.props.community.subscription ? "" : " ")}>
											{this.props.second ? this.props.community.my_communities.active.length : this.props.community.communities_activated.length}
											&nbsp;/&nbsp;
											{this.props.community.subscription ?
												this.props.community.subscription.quantity + this.props.community.tickets
												: (this.props.community.is_sending ?
													<i className="fas fa-spinner fa-spin"/>
													: "0")}
										</h4>
									</div>
								</div>
								<div className="invoice-div">
									<div className="filtersheader-div">
										<h4 className="table-header">New Activations</h4>
									</div>
									<div>
										<h4 className={"value"}>
											{this.props.community.communities_activated.length - this.props.community.tickets}
										</h4>
									</div>
								</div>
								<div className="invoice-div">
									<div className="filtersheader-div">
										<h4 className="table-header">Price</h4>
									</div>
									<div>
										<h4 className={"value" + (this.props.community.subscription ? "" : " ")}>
											{subscription_price}
										</h4>
									</div>
								</div>
								{this.props.second || this.props.community.is_sending ? null :
									<div className="invoice-div">
										<div className="filtersheader-div">
											<h4 className="table-header">Discount code</h4>
										</div>
										<input type="text"
													 className="subscription-discount-input w3-half w3-center w3-normal"
													 style={{
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
								}
							</div>
						</div>
						<div className="div-block-147">
							<div className="accordionheader-div nounderline">
								<h3>Billing Summary:</h3>
								<Popup
									trigger={<i className={"fas fa-question-circle tooltip-icon"}/>}
									position={"left center"}>
									<div>
										This is a summary showing you the total dollar amount due today as well as the upcoming payments you
										can expect based on your number of active communities.<br/><br/>
										<b>Note</b>: Any communities deactivated between now and the end of your billing cycle will not be
										included in
										upcoming payments. If you have 0 active communities at the end of your billing cycle, your upcoming
										payment(s) will be $0.00.
									</div>
								</Popup>
							</div>
							<div className="subscribe-container">
								{this.props.community.trialing ? null : (
									<div className="invoice-div">
										<div>
											<div className="filtersheader-div">
												<h4
													className="table-header">Subtotal</h4>
											</div>
										</div>
										<div>
											<h4 className={"value" + (this.props.community.subscription ? "" : " ")}>
												{this.props.community.subscription ? (showAmount(prorated * this.props.community.subscription.plan.amount))
													: (this.props.community.is_sending ?
														<i className="fas fa-spinner fa-spin"/>
														: showAmount(this.props.community.communities_activated.length * this.props.community.plan_price))}
											</h4>
										</div>
									</div>
								)}
								{this.props.community.subscription !== "1" ? null :
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4 className="table-header">Taxes and Fees</h4>
											</div>
											<div>
												<h4 className={"value" + (this.props.community.subscription ? "" : " ")}>
													{this.props.community.last_invoice ?
														showAmount(this.props.community.last_invoice.tax)
														: "$0.00"}
												</h4>
											</div>
										</div>
									</div>
								}
								<div className="invoice-div top">
									<div className="filtersheader-div" style={{display: "block"}}>
										<h4 className="table-header">Due Today</h4>
										{this.props.community.subscription ? (this.props.community.trialing ? (
												<h4 className={"w3-small w3-text-green"}>
													<br/>
													Free trial
													through {new Date(this.props.community.subscription.trial_end * 1000).toLocaleDateString('en-US')}
												</h4>) : null)
											: (
												this.props.community.trial_period_days > 0 ? (
														<h4 className={"w3-small w3-text-green"} style={{paddingTop: "10px"}}>
															Free trial through {upcoming_duedate.toLocaleDateString('en-US')}
														</h4>)
													: null)}
									</div>
									<div>
										<div className="div10-bottom right">
											{this.props.community.trialing || (!this.props.community.subscription && this.props.community.trial_period_days > 0) ? null : (
												<h4
													className={"value " + (this.props.community.trialing ? "strikethrough" : "") + (this.props.community.subscription ? "" : " ")}>
													{this.props.community.subscription ?
														showAmount(prorated * this.props.community.communities_activated.length * this.props.community.subscription.plan.amount)
														: (this.props.community.is_sending ?
															<i className="fas fa-spinner fa-spin"/>
															: "$0.00")}
												</h4>
											)}
											{this.props.community.trialing || (!this.props.community.subscription && this.props.community.trial_period_days > 0) ? (
												<h4 className="value w3-text-green right">
													{this.props.community.trialing ? "$0.00" : (this.props.community.subscription ?
														showAmount(prorated * this.props.community.subscription.plan.amount)
														: this.props.community.trial_period_days > 0 ? "$0.00" : this.props.community.plan_price)}
												</h4>
											) : null}
										</div>
									</div>
								</div>
								<div className="invoice-div top upcoming">
									<div className="filtersheader-div">
										<h4 className="table-header">
											Upcoming Payments
										</h4>
									</div>
									<div className={"table-item"}>
										<div className={"upcoming-payment-table-row header"}>
											<div>Date</div>
											<div>Active</div>
											<div>Price</div>
											<div>Total</div>
										</div>
										<div className={"upcoming-payment-table-row"}>
											<div>
												{this.props.community.subscription ?
													next_due_date.toLocaleDateString('en-US')
													: (this.props.community.is_sending ?
														<i className="fas fa-spinner fa-spin"/>
														: upcoming_duedate.toLocaleDateString('en-US'))}
											</div>
											<div>
												{this.props.community.my_communities.active.length + this.props.community.communities_activated.length}
											</div>
											<div>{subscription_price}</div>
											<div>{due_amount}</div>
										</div>
										<div className={"upcoming-payment-table-row"}>
											<div>
												{this.props.community.subscription ?
													next_month1.toLocaleDateString('en-US')
													: (this.props.community.is_sending ?
														<i className="fas fa-spinner fa-spin"/>
														: upcoming_duedate1.toLocaleDateString('en-US'))}
											</div>
											<div>
												{this.props.community.my_communities.active.length + this.props.community.communities_activated.length}
											</div>
											<div>{subscription_price}</div>
											<div>{due_amount}</div>
										</div>
										<div className={"upcoming-payment-table-row"}>
											<div>
												{this.props.community.subscription ?
													next_month2.toLocaleDateString('en-US')
													: (this.props.community.is_sending ?
														<i className="fas fa-spinner fa-spin"/>
														: upcoming_duedate2.toLocaleDateString('en-US'))}
											</div>
											<div>
												{this.props.community.my_communities.active.length + this.props.community.communities_activated.length}
											</div>
											<div>{subscription_price}</div>
											<div>{due_amount}</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="div-block-147 payiinfo">
							<div className="accordionheader-div nounderline">
								<h3>Payment Information:</h3>
								{this.props.community.subscription ? (
									<div className={"edit-card"}>
										<Link to="#" className={"table-link"}
													onClick={this.clickEditCard}>
											{this.state.editing_card ? (
												<i className={"fas fa-save"}/>
											) : (
												<i className={"fas fa-pen"}/>
											)}
										</Link>
										{this.state.editing_card ? (
											<Link to="#" className={"table-link w3-large"}
														onClick={this.cancelEditCard}>
												<i className={"fas fa-times"}/>
											</Link>
										) : null}
									</div>
								) : null}
							</div>
							<div className="form-block w-form">
								<div className="subscribe-container">
									<div className="invoice-div">
										{!this.props.second || this.state.editing_card ? (
											<input type="text" className="card-holder-name"
														 style={{paddingTop: "10px", borderTop: "1px solid #ddd9e1"}}
														 title="Name on card" placeholder="Name on card"
														 id="name_on_card" onChange={this.onChange}
														 value={this.state.name_on_card} autoFocus/>
										) : (
											<div className={"grey"} style={{
												paddingTop: "10px",
												width: "100%",
												borderTop: "1px solid #e8e5ea",
											}}>
												{customer ? customer.sources.data[0].name : "(Card holder name)"}
											</div>
										)}
									</div>
									{!this.props.second || this.state.editing_card ? (
										<div className="form-row">
											<CardElement className="CardInfoStyle" style={cardStyle}
																	 disabled={!this.state.editing_card && this.props.second}/>
										</div>
									) : (
										this.props.community.is_setting_card ? (
											<div className={"w3-container w3-center w3-margin-top"}>
												<i className="fas fa-spinner fa-spin"/>
											</div>
										) : (
											customer ? (
												<div className={"form-row"}>
													<div className={"card-detail-item w3-row w3-text-grey"}>
														<div className={"w3-col s1"}>
															<img alt={"Payment card"}
																	 src={`/img/card/icon-${customer.sources.data[0].brand.toLowerCase()}.svg`}/>
														</div>
														<div className={"w3-col s5"} title={"Card number"}>
															**** **** ****&nbsp;
															{customer.sources.data[0].last4}
														</div>
														<div className={"w3-col s3"} title={"Expiration"}>
															{customer.sources.data[0].exp_month}/{customer.sources.data[0].exp_year}
														</div>
														<div className={"w3-col s1"}
																 title={customer.sources.data[0].cvc_check}>
															***
														</div>
														<div className={"w3-col s2"}
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
								<div className="submit-row w3-margin-top">
									<button
										onClick={this.state.editing_card ? null : this.handleActivateCommunity}
										className={"form1-submit round w-button" + (this.state.editing_card ? " disabled" : "")}>
										{this.props.community.subscription ?
											"Complete Activation"
											: "Complete Activation"}
									</button>
								</div>
								<div className="div-block-205">
									<span className="fineprint">By registering you are agreeing to our</span>
									<Link to="#" onClick={this.showModal} className="fineprint link">
										Terms and Conditions
									</Link>
								</div>
								{
									this.props.community.activating || this.props.community.active_status !== 0 ? (
										this.props.community.active_status === 1 ? (
											<div className={"heading-success"}>Success</div>
										) : (this.props.community.active_status === 2 ? (
											<div className={"heading-success"}>Failed</div>
										) : null)
									) : null
								}
							</div>
							<div className="strikethrough-div" style={{paddingTop: "20px"}}>
								<div className="or-div"/>
							</div>
							<div style={{padding: "10px 20px 0"}}>
								<div className={"subscription-lock-icon"}>
									<i className="fas fa-lock"/>
								</div>
								<p className="fineprint subscription">
									Payments are processed by <span className="stripe-label">Stripe</span> and secured by
									a
									256-bit SSL&nbsp;encryption.
								</p>
							</div>
							<div className="strikethrough-div" style={{paddingTop: "20px"}}>
								<div className="or-div"/>
							</div>
							<div className="div-block-304">
								<div id="w-node-9c1a49011d3b-15956658" className="div-block-308"><h3>Frequently Asked Questions</h3>
								</div>
								<div>
									<div className="accordingcontainer-div" onClick={() => {
										this.setState({accordion_collapsed1: !this.state.accordion_collapsed1});
									}}>
										<div className="accordionheader-div"
												 style={{borderBottomStyle: this.state.accordion_collapsed1 ? "" : "solid"}}
										>
											<h3 className="accordion-header">What happens when I click
												activate?&nbsp;</h3></div>
										<div style={{height: this.state.accordion_collapsed1 ? "0px" : "initial"}}
												 className="accordioncontent-div">
											<div className="_20topbottom-div"><p>A metaphorical lantern is lit and the technology goes to
												work. But actually, the community or communities you’ve selected to activate will automatically
												move to your “Active” communities tab, as well as appear in public search results. You can edit
												or deactivate any community at any time.</p></div>
										</div>
									</div>
								</div>
								<div>
									<div className="accordingcontainer-div" onClick={() => {
										this.setState({accordion_collapsed2: !this.state.accordion_collapsed2});
									}}>
										<div className="accordionheader-div"
												 style={{borderBottomStyle: this.state.accordion_collapsed2 ? "" : "solid"}}
										>
											<h3 className="accordion-header">What if I change my mind and
											want to deactivate one or all of them?&nbsp;</h3></div>
										<div style={{height: this.state.accordion_collapsed2 ? "0px" : "initial"}} className="accordioncontent-div">
											<div className="_20topbottom-div"><p>Of course. Simply deactivate one or all of them before the
												end of your free trial or billing cycle if you wish to reduce or cancel any upcoming payments.
												If you do not have any active communities, your upcoming payments on your Account page will show
												$0.00 and you will not be charged.&nbsp;</p></div>
										</div>
									</div>
								</div>
								<div>
									<div className="accordingcontainer-div" onClick={() => {
										this.setState({accordion_collapsed3: !this.state.accordion_collapsed3});
									}}>
										<div className="accordionheader-div"
												 style={{borderBottomStyle: this.state.accordion_collapsed3 ? "" : "solid"}}
										>
											<h3 className="accordion-header">Will I be charged again if I
											deactivate a community and activate a new one in its place?&nbsp;</h3></div>
										<div style={{height: this.state.accordion_collapsed3 ? "0px" : "initial"}} className="accordioncontent-div">
											<div className="_20topbottom-div"><p>No. You can deactivativate a community and activate a new one
												in its place at no charge. If you do not activate a new one in its place, you will not be
												charged for an active community on the upcoming billing cycle and your upcoming payments tab on
												your account page will reflect accordingly.&nbsp;</p></div>
										</div>
									</div>
								</div>
								<div>
									<div className="accordingcontainer-div" onClick={() => {
										this.setState({accordion_collapsed4: !this.state.accordion_collapsed4});
									}}>
										<div className="accordionheader-div"
												 style={{borderBottomStyle: this.state.accordion_collapsed4 ? "" : "solid"}}
										>
											<h3 className="accordion-header">Will I still be charged my
											upcoming payment if I deactivate all of my communities?&nbsp;</h3></div>
										<div style={{height: this.state.accordion_collapsed4 ? "0px" : "initial"}} className="accordioncontent-div">
											<div className="_20topbottom-div"><p>No. If you do not have any active communities, your upcoming
												payments will show $0.00 and you will not be charged.&nbsp;</p></div>
										</div>
									</div>
								</div>
								<div>
									<div className="accordingcontainer-div" onClick={() => {
										this.setState({accordion_collapsed5: !this.state.accordion_collapsed5});
									}}>
										<div className="accordionheader-div"
												 style={{borderBottomStyle: this.state.accordion_collapsed5 ? "" : "solid"}}
										>
											<h3 className="accordion-header">Can I edit, update, or delete
											a community after I activate it?&nbsp;</h3></div>
										<div style={{height: this.state.accordion_collapsed5 ? "0px" : "initial"}} className="accordioncontent-div">
											<div className="_20topbottom-div"><p>Absolutely. As a community owner, you have complete control
												over the information provided and can update or deactivate it at any time.</p></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div style={{minHeight: "86px"}}>

				</div>
			</>
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
	activateMultiCommunity: PropTypes.func.isRequired,
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
		activateMultiCommunity,
		hideActivateDlg,
	}
)(injectStripe(StripeSubscription));
