import React, {Component} from "react";
import '../../css/dashboard.css';
import '../../css/admin.css';
import ProfileContainer from "../../components/profile-container";
import MyCommunities from "../../components/my-communites";
import SiteFooter from "../../components/site-footer";
import StripeSubscription from "../../components/stripe-subscription";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo} from "../../actions/auth-actions";
import {getBillingStatus, clearLastInvoice, showActivateDlg} from "../../actions/community-actions";
import {Elements} from "react-stripe-elements";
import SiteHeader from "../../components/site-header";

class Admin extends Component{
	constructor(props){
		super(props);

		this.state = {
			errors: {},
		};

		this.showSubDlg = this.showSubDlg.bind(this);
	}

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

	showSubDlg(){
		this.props.showActivateDlg();
	}

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
								<i className="fas fa-spinner fa-spin"> </i>
							</div>
						</div>
						<main className="admin-body w3-row"
									style={{filter: (this.props.community.activating || this.props.community.deactivating || this.props.community.showing) ? "blur(4px)" : "none"}}>
							<div className="div-block-213">
								<div id="w-node-5ba554098c6d-44cf2aa3" className="div-block-171">
									<div className="div-block-231"><a href="/create-a-community" className="button-create w-button"><em
											className="newcommunity-icon"></em> <span className="text-span-3">New Community</span></a></div>
								</div>
								<div id="w-node-5ba554098c6a-44cf2aa3" className="div-block-210"><h1 className="heading-40">Dashboard -
									Communities</h1></div>
								<div id="w-node-5ba554098c5f-44cf2aa3" className="div-block-210">
									<div className="div-block-215 underline"><a href="#" className="link-6"><em
											className="italic-text-7 current"></em></a></div>
									<div className="div-block-215"><a href="/dashboard-results" className="link-6"><em
											className="italic-text-7 gray"></em></a></div>
									<div className="div-block-215"><a href="/dashboard-results" className="link-6"><em
											className="italic-text-7 gray"></em></a></div>
								</div>
							</div>
							<div className={"admin-wrapper"}>
								<div className="admin-left w3-col">
									<ProfileContainer/>
								</div>
								<div className="admin-right w3-rest">
									<MyCommunities status="active" handleShowSubDlg={this.showSubDlg}/>
									<MyCommunities status="inactive" handleShowSubDlg={this.showSubDlg}/>
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
