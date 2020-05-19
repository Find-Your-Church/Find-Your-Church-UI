import React, {Component} from "react";
import '../../css/dashboard.css';
import '../../css/admin.css';
import MyCommunities from "../../components/my-communites";
import SiteFooter from "../../components/site-footer";
import StripeSubscription from "../../components/stripe-subscription";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo} from "../../actions/auth-actions";
import {getBillingStatus, clearLastInvoice, showActivateDlg} from "../../actions/community-actions";
import {Elements} from "react-stripe-elements";
import SiteHeader from "../../components/site-header";
import {Link} from "react-router-dom";

class Admin extends Component{
	constructor(props){
		super(props);

		this.state = {
			errors: {},
			showed_active: true,
		};
	}

	selectTabActive = isActive => {
		this.setState({showed_active: isActive});
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	componentDidMount(){
		const customer_info = {
			user_id: this.props.auth.user.id,
		};

		this.props.getUserInfo({
			user_id: this.props.auth.user.id,
		});
		this.props.getBillingStatus(customer_info, this.props.history);
	}

	showSubDlg = () => {
		this.props.showActivateDlg();
	};

	render(){
		/**
		 * TODO: replace:
		 * style={{display: this.props.community.is_showing ? "block" : "block"}}
		 * to
		 * style={{display: this.props.community.is_showing ? "block" : "none"}}
		 */
		return (
			<>
				<SiteHeader/>
				<div>
					<div id={"stripe-modal"} className={"w3-modal"}
							 style={{display: this.props.community.showing ? "block" : "none"}}>
						<Elements>
							<StripeSubscription second={!!this.props.community.subscription}/>
						</Elements>
					</div>
					<div id={"spinning-modal"} className={"w3-modal"}
							 style={{display: (this.props.community.activating || this.props.community.deactivating) ? "block" : "none"}}>
						<div className="w3-display-middle w3-text-white w3-jumbo">
							<i className="fas fa-spinner fa-spin"/>
						</div>
					</div>
					<main className="admin-body w3-row"
								style={{
									filter: (this.props.community.activating || this.props.community.deactivating || this.props.community.showing) ? "blur(4px)" : "none",
									backgroundColor: "#e8e5eb",
								}}>
						<div className={"admin-wrapper"}>
							<div className="div-block-213">
								<div id="w-node-5ba554098c6d-44cf2aa3" className="div-block-171">
									<div className="div-block-231">
										<Link to="/create-new-community" className="button-create w-button">
											<i className={"fas fa-users"}/> <span className="text-span-3">New Community</span>
										</Link>
									</div>
								</div>
								<div id="w-node-5ba554098c6a-44cf2aa3" className="div-block-210">
									<h1 className="heading-40">Communities</h1>
								</div>
								<div id="w-node-5ba554098c5f-44cf2aa3" className="div-block-210">
									<div className="div-block-215 underline">
										<Link to="/dashboard" className="link-6">
											<em className="italic-text-7 current"><i className="fas fa-th"/></em>
										</Link>
									</div>
									{/*
										<div className="div-block-215">
											<Link to="/dashboard-results" className="link-6">
												<em className="italic-text-7 gray"><i className="fas fa-user-circle"/></em>
											</Link>
										</div>
										*/}
									<div className="div-block-215">
										<Link to="/dashboard-results" className="link-6">
											<em className="italic-text-7 gray"><i className="fas fa-code"/></em>
										</Link></div>
								</div>
							</div>
							{/*
								<div className="admin-left w3-col">
									<ProfileContainer/>
								</div>
								*/}
							<div className="admin-right w3-rest">
								<div className="tabs-menu-6 w-tab-menu" role="tablist">
									<div data-w-tab="Tab 1"
											 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_active ? "w--current" : ""}`}
											 onClick={() => this.selectTabActive(true)}>
										<div>Active</div>
									</div>
									<div data-w-tab="Tab 2"
											 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_active ? "" : "w--current"}`}
											 onClick={() => this.selectTabActive(false)}>
										<div>Inactive</div>
									</div>
								</div>
								<MyCommunities status={this.state.showed_active ? "active" : "inactive"}
															 handleShowSubDlg={this.showSubDlg} showed={true}/>
								<MyCommunities status={this.state.showed_active ? "inactive" : "active"}
															 handleShowSubDlg={this.showSubDlg} showed={false}/>
							</div>
						</div>
					</main>
					<SiteFooter/>
				</div>
			</>
		);
	}
}

Admin.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
	clearLastInvoice: PropTypes.func.isRequired,
	showActivateDlg: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{getUserInfo, getBillingStatus, clearLastInvoice, showActivateDlg}
)(Admin);
