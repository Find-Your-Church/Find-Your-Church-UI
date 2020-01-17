import React, {Component} from "react";
import {Link} from "react-router-dom";
import '../css/account.css';

class Account extends Component{
	constructor(props){
		super(props);

		this.state = {
			showedInvoice: false,
		};

		this.toggleInvoice = this.toggleInvoice.bind(this);
	}

	toggleInvoice(){
		this.setState({showedInvoice: !this.state.showedInvoice});
	}

	render(){
		return (
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
										<h4 id="w-node-cb8d7881b96d-27fc25a8" className="table-item">firstName
											lastName</h4>
										<Link to="#" className="table-link">Edit</Link>
									</div>
									<div className="table-row">
										<h4 className="table-header">Email</h4>
										<h4 className="table-item">useremail@email.com</h4>
										<Link to="#" className="table-link">Edit</Link>
									</div>
									<div className="table-row">
										<h4 className="table-header">Password</h4>
										<h4 className="table-item">********</h4>
										<Link to="#"
											  className="table-link">Change</Link>
									</div>
									<div className="table-row">
										<div id="w-node-cb8d7881b980-27fc25a8" className="flexdiv-left">
											<h4 className="table-header">Referral Code</h4>
											<img src="/img/tooltip-icon.png"
												 alt="" className="tooltip-icon"/>
										</div>
										<h4 className="table-item">firstName1234</h4>
										<Link to="#" className="table-link">Change</Link>
									</div>
									<div className="table-row">
										<h4 className="table-header">Registration</h4>
										<h4 className="table-item">(dateRegistered)</h4>
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
										to="#" className="table-link" onClick={this.toggleInvoice}>Show Invoice</Link>
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
													<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
												</div>
												<h4 className="invoice-item">05</h4>
											</div>
											<div className="invoice-row">
												<div className="flexdiv-left">
													<h4 className="table-header">Price Per Community</h4>
													<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
												</div>
												<h4 className="invoice-item">$8.98</h4>
											</div>
											<div className="invoice-row">
												<div className="flexdiv-left">
													<h4 className="table-header">Subtotal</h4>
													<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
												</div>
												<h4 className="invoice-item">$44.90</h4>
											</div>
											<div className="invoice-row">
												<div className="flexdiv-left">
													<h4 className="table-header">Taxes and Fees</h4>
													<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
												</div>
												<h4 className="invoice-item">$1.64</h4>
											</div>
											<div className="invoice-row">
												<div className="flexdiv-left">
													<h4 className="table-header">Total due on 01/05/2020</h4>
													<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
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
										<h4 className="table-item">firstName lastName</h4>
									</div>
									<div className="table-row">
										<h4 className="table-header">Card</h4>
										<h4 className="table-item">**** **** ****&nbsp;1234</h4>
										<Link to="#" className="table-link">Update</Link>
									</div>
									<div className="table-row">
										<h4 className="table-header">Billing Zip Code</h4>
										<h4 className="table-item">12345</h4>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}

export default Account;
