import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/stripe-subscription.css";

class StripeSubscription extends Component{
	render(){
		return (
			<div className="subscriptioncontainer-div w3-modal-content">
				<div className="header1-div gradient shadow">
					<h3 className="header3 center">Activate Your Community</h3>
				</div>
				<div className="container-div1">
					<div className="columns-container">
						<div>
							<div className="div-block-147">
								<div className="accordionheader-div nounderline">
									<h3>Payment Summary:</h3>
									<img
										src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dacdae1cb7e177886023af5_tooltip%20icon.png"
										alt="" className="tooltip-icon"/>
								</div>
								<div className="subscribe-container">
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4
													className="table-header">Activations</h4>
												<img
													src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dacdae1cb7e177886023af5_tooltip%20icon.png"
													alt="" className="tooltip-icon"/>
											</div>
											<div>
												<h4>01</h4>
											</div>
										</div>
									</div>
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="filtersheader-div">
												<h4 className="table-header">Price</h4>
												<img
													src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dacdae1cb7e177886023af5_tooltip%20icon.png"
													alt="" className="tooltip-icon"/>
											</div>
											<div>
												<h4>$8.98</h4>
											</div>
										</div>
									</div>
									<div className="invoice-row">
										<div className="invoice-div">
											<div className="div-block-141">
												<h4 className="table-header">Discount
													code</h4>
											</div>
											<div className="div-block-140">
												<div className="discount-formblock w-form">
													<form id="email-form-2" name="email-form-2" data-name="Email Form 2"
														  className="discount-form">
														<input type="email"
															   className="discount-field w-input"
															   maxLength="256" name="email"
															   data-name="Email"
															   placeholder="Enter discount code here"
															   id="email" required=""/>
														<input
															type="submit" value="Apply" data-wait="Please wait..."
															className="discountsubmit-button w-button"/>
													</form>
													<div className="success-message w-form-done">
														<div className="text-block-2">discount label applied!</div>
														<img
															src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5deaba55e942e7562b36b873_x-circle-512.png"
															alt="" className="delete-icon"/>
													</div>
													<div className="error-message w-form-fail">
														<div>Code not found. Please try again!</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="div-20top">
								<div className="div-block-147">
									<div className="accordionheader-div nounderline">
										<h3>Payment Summary:</h3>
										<img
											src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dacdae1cb7e177886023af5_tooltip%20icon.png"
											alt="" className="tooltip-icon"/>
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
													<h4>$8.98</h4>
												</div>
											</div>
										</div>
										<div className="invoice-row">
											<div className="invoice-div">
												<div className="filtersheader-div">
													<h4 className="table-header">Taxes
														and Fees</h4>
												</div>
												<div>
													<h4>$0.62</h4>
												</div>
											</div>
										</div>
										<div className="invoice-row">
											<div className="invoice-div top">
												<div className="filtersheader-div">
													<h4 className="table-header">Due
														Today</h4>
												</div>
												<div>
													<div className="div10-bottom right">
														<h4
															className="strikethrough">$9.60</h4>
													</div>
													<div>
														<h4 className="green">$0.00</h4>
													</div>
												</div>
											</div>
										</div>
										<div className="invoice-row">
											<div className="invoice-div top">
												<div className="filtersheader-div">
													<h4 className="table-header">Next
														Payments</h4>
												</div>
												<div>
													<div className="div10-bottom">
														<h4>$9.60 on 11/04/2020</h4>
													</div>
													<div className="div10-bottom">
														<h4>$9.60 on 12/04/2020</h4>
													</div>
													<div>
														<h4>$9.60 on 01/04/2020</h4>
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
								<div className="div10-bottom">
									<h3>Payment Information:</h3>
								</div>
								<div className="form-block w-form">
									<form id="email-form" name="email-form" data-name="Email Form">
										<div className="subscribe-container inputs">
											<div className="form-row">
												<div className="input-div">
													<input type="text"
														   className="form-input w-input"
														   maxLength="256" name="Name-on-card"
														   data-name="Name On Card"
														   placeholder="Jane Smith"
														   id="Name-on-card" required=""/>
												</div>
											</div>
											<div className="form-row">
												<div className="input-div">
													<input type="text"
														   className="inputwithicon w-input"
														   maxLength="256" name="Card-number"
														   data-name="Card Number"
														   placeholder="**** **** **** 1234"
														   id="Card-number" required=""/>
													<img
														src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5ded60e4cd17302c439f35c7_2_-_Visa-512.png"
														alt="" className="card-icon"/>
												</div>
											</div>
											<div className="form-row">
												<div className="input-div">
													<input type="text"
														   className="form-input exp-date w-input"
														   maxLength="256" name="Exp.-Date-2"
														   data-name="Exp Date 2"
														   placeholder="01/2020" id="Exp.-Date-2"
														   required=""/>
													<input type="text"
														   className="form-input csv w-input"
														   maxLength="256"
														   name="CSV-2"
														   data-name="CSV 2"
														   placeholder="CSV"
														   id="CSV-2"
														   required=""/>
													<input
														type="text" className="form-input zip-code w-input"
														maxLength="256"
														name="Zip-code-2" data-name="Zip Code 2"
														placeholder="Billing Zip Code" id="Zip-code-2"
														required=""/>
												</div>
											</div>
										</div>
										<div className="submit-row">
											<input type="submit" value="Activate Community"
												   data-wait="Please wait..."
												   className="form1-submit round w-button"/>
										</div>
									</form>
									<div className="w-form-done">
										<div>Thank you! Your submission has been received!</div>
									</div>
									<div className="w-form-fail">
										<div>Oops! Something went wrong while submitting the form.</div>
									</div>
								</div>
							</div>
							<div className="div-20top">
								<p className="fineprint subscription">Payments are processed
									by <em className="italic-text">Stripe</em> and secured by a 256-bit
									SSL&nbsp;encryption.
								</p>
							</div>
							<Link to={"#"} onClick={this.props.handleHideSubDlg}>Cancel</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StripeSubscription;
