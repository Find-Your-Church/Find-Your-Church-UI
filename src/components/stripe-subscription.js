import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {CardElement, injectStripe} from "react-stripe-elements";
import {registerCard, clearLastInvoice, activateCommunity, hideActivateDlg} from "../actions/community-actions";
import "../css/stripe-subscription.css";
import "../css/stripe-style.css";

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

			editing_card: false,
		};

		this.clickEditCard = this.clickEditCard.bind(this);
		this.hideActivationDialog = this.hideActivationDialog.bind(this);
		this.handleActivateCommunity = this.handleActivateCommunity.bind(this);
	}

	showAmount(cents){
		return (cents / 100).toLocaleString('en-US', {
			style: 'currency', currency: 'USD'
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

	handleActivateCommunity(e){
		if(this.props.stripe){
			/**
			 * activate this community as existed stripe customer.
			 */
			this.props.activateCommunity({
				community_id: this.props.community.community_activated,
				source: null,
				email: this.props.auth.user.email,
			});
		}
		else{
			console.log("Stripe object was not initialized.")
		}
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
			<div className="subscriptioncontainer-div w3-modal-content w3-card-4 w3-animate-zoom">
				<div className="header1-div gradient shadow">
					<h3 className="header3 center">
						{this.props.community.dlg_title}
					</h3>
				</div>
				<div className="container-div1">
					<div className="columns-container">
						<div>
							<div className="div-block-147">
								<div className="accordionheader-div nounderline">
									<h3>Account Summary</h3>
									<i className={"fas fa-question-circle tooltip-icon"}> </i>
								</div>
								<div className="subscribe-container">
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4 className="table-header">Activations</h4>
												<i className={"fas fa-question-circle tooltip-icon"}> </i>
											</div>
											<div>
												<h4 className={"value"}>
													{this.props.community.subscription ?
														this.props.community.subscription.quantity
														: (this.props.community.is_sending ?
															<i className="fas fa-spinner fa-spin"> </i>
															: "-")}
													&nbsp;/&nbsp;
													{this.props.community.my_communities.active.length
													+ this.props.community.my_communities.inactive.length}
												</h4>
											</div>
										</div>
									</div>
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4 className="table-header">Price</h4>
												<i className={"fas fa-question-circle tooltip-icon"}> </i>
											</div>
											<div>
												<h4 className={"value"}>
													{this.props.community.subscription ?
														this.showAmount(this.props.community.subscription.plan.amount)
														: (this.props.community.is_sending ?
															<i className="fas fa-spinner fa-spin"> </i>
															: "-")}
												</h4>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="div-20top">
								<div className="div-block-147">
									<div className="accordionheader-div nounderline">
										<h3>Billing Summary</h3>
										<i className={"fas fa-question-circle tooltip-icon"}> </i>
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
													<h4 className={"value"}>
														{this.props.community.subscription ?
															this.showAmount(this.props.community.subscription.plan.amount)
															: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"> </i>
																: "-")}
													</h4>
												</div>
											</div>
										</div>
										<div className="invoice-row">
											<div className="invoice-div">
												<div className="filtersheader-div">
													<h4 className="table-header">Taxes and Fees</h4>
												</div>
												<div>
													<h4 className={"value"}>
														{this.props.community.last_invoice ?
															this.showAmount(this.props.community.last_invoice.tax)
															: "-"}
													</h4>
												</div>
											</div>
										</div>
										<div className="invoice-row">
											<div className="invoice-div top">
												<div className="filtersheader-div">
													<h4 className="table-header">Due Today</h4>
												</div>
												<div>
													<div className="div10-bottom right">
														<h4 className="value strikethrough">
															{this.props.community.subscription ?
																this.showAmount(this.props.community.subscription.plan.amount
																	+ (this.props.community.last_invoice ?
																		this.props.community.last_invoice.tax / 100 : 0))
																: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: "-")}
														</h4>
														<h4 className="value w3-text-green right">
															{this.props.community.last_invoice ?
																this.showAmount(this.props.community.last_invoice.subtotal)
																: "-"}
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
														<h4 className={"value"}>
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
														</h4>
													</div>
													<div className="div10-bottom">
														<h4 className={"value"}>
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
														</h4>
													</div>
													<div className="div10-bottom">
														<h4 className={"value"}>
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
									<Link to="#" className={"w3-text-indigo w3-hover-text-blue"}
										  onClick={this.clickEditCard}>
										{this.state.editing_card ? "Save" : "Edit"}
									</Link>
								</div>
								<div className="form-block w-form">
									<div className="subscribe-container inputs">
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
									{this.props.community.is_sending ? (
										this.props.community.msg ? (
											" " // this.props.community.msg
										) : null
									) : (
										<div className="submit-row">
											<button onClick={this.handleActivateCommunity}
													className="form1-submit round w-button">
												Activate Community
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
	{registerCard, clearLastInvoice, activateCommunity, hideActivateDlg}
)(injectStripe(StripeSubscription));
