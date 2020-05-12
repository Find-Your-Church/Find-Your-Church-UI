import React, {Component} from "react";
import "../css/communities.css"
import Thumbnail from "./thumbnail";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
	activateMultiCommunity,
	clearActiveStatus,
	clearCouponFailed,
	clearCouponVerified,
	deactivateMultiCommunity,
	deleteMultiCommunity,
	getBillingStatus,
	getMyCommunities,
	pickMultiCommunity
} from "../actions/community-actions";
import formatNumber from "../utils/formatNumber";
import Popup from "reactjs-popup";
import community_config from "../conf/community-conf";

class MyCommunities extends Component{
	constructor(props){
		super(props);

		this.state = {
			selected_category: "",
			selected_count: 0,
		};

		this.selected_communities = []; // array of community IDs

		this.refresh = this.refresh.bind(this);

		this.refresh();
	}

	selectCommunity = (community_id, selected = true) => {
		if(selected){
			if(!this.selected_communities.includes(community_id)){
				this.selected_communities.push(community_id);
			}
		}
		else{
			if(this.selected_communities.includes(community_id)){
				const index = this.selected_communities.indexOf(community_id);
				if (index > -1) {
					this.selected_communities.splice(index, 1);
				}
			}
		}

		this.setState({selected_count: this.selected_communities.length});

		console.log("selected: ", this.selected_communities);
	};

	refresh(){
		this.props.getMyCommunities(this.props.auth.user.id, this.props.status === "active");
	}

	onChangeCategory = e => {
		this.setState({selected_category: e.target.value});
	};

	handleActivateMulti = () => {
		if(this.selected_communities.length > 0){
			this.props.clearActiveStatus();
			this.props.clearCouponVerified();
			this.props.clearCouponFailed();
			this.props.getBillingStatus({
				user_id: this.props.auth.user.id,
			}, this.props.history);

			// is available just move up?
			if(this.props.community.subscription && (this.props.community.my_communities.active.length + this.selected_communities.length <= this.props.community.subscription.quantity + this.props.community.tickets)){
				this.props.activateMultiCommunity({
					id: this.props.auth.user.id,
					community_ids: this.selected_communities,
					source: null,
					coupon: null,
				});
			}
			else{
				// pick the community to be activated
				this.props.pickMultiCommunity({
					community_ids: this.selected_communities,
				});

				// show modal dialog
				this.props.handleShowSubDlg();
			}

			this.selected_communities = [];
			this.setState({selected_count: this.selected_communities.length});
		}
	};

	handleDeactivateMulti = () => {
		if(this.selected_communities.length > 0){
			// do deactivate the community.
			this.props.deactivateMultiCommunity({
				id: this.props.auth.user.id,
				community_ids: this.selected_communities,
			});

			this.selected_communities = [];
			this.setState({selected_count: this.selected_communities.length});
		}
	};

	handleDeleteMulti = () => {
		if(this.selected_communities.length > 0){
			if(true === window.confirm(`Delete ${this.selected_communities.length} communities?`)){
				this.props.deleteMultiCommunity({
					community_ids: this.selected_communities,
				}, this.props.history);

				this.selected_communities = [];
				this.setState({selected_count: this.selected_communities.length});
			}
		}
	};

	handleCategoryOver = e => {
		console.log(e);
	};

	render(){
		return (
				<div className="communities-body">
					<div className="dashboard-container">
						<div className="containerheader-div underline">
							<div className="flexdiv-left">
								<div className="container-header">
									{this.props.status.replace(/^\w/, c => c.toUpperCase())} Communities
									{this.props.status === "active" ? (
											<div className={"counter-part"}>
												<div className={"counter-part-border"}>
													{formatNumber(this.props.community.my_communities.active.length)}
													&nbsp;/&nbsp;
													{this.props.community.subscription ?
															formatNumber(this.props.community.subscription.quantity + this.props.community.tickets)
															: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: "00")}
												</div>
											</div>
									) : null}
									<Popup
											trigger={<i style={{cursor: "pointer"}}
																	className={"communities-tooltip fas fa-question-circle tooltip-icon"}> </i>}
											position={this.props.status === "active" ? "left top" : "left bottom"}>
										<div>
											{this.props.status === "active" ? (
													"These communities WILL be displayed on your website when you use the iFrame feature and will appear in public search\n" +
													"results when they match a users criteria."
											) : (
													"These communities WILL NOT be displayed on your website when you use the iFrame feature and WILL NOT appear in\n" +
													"public search results if they match a users criteria. To activate a community, click the checkbox on the community or\n" +
													"communities you wish to activate, and then click \"Activate\". New communities are inactive by default and must be\n" +
													"manually activated."
											)}
										</div>
									</Popup>
								</div>
							</div>
						</div>

						<div className="div-block-208">
							<div id="w-node-d486187d7c74-44cf2aa3" className="div-block-216">
								<div className="form-block-5">
									<form id="email-form-2" name="email-form-2" data-name="Email Form 2" className="form-3">
										<select
												id="sel_category" name="sel_category" className="select-field w-select"
												onChange={this.onChangeCategory}
												style={{backgroundImage: "url('../img/icon-down3-purple.svg')"}}
										>
											<option value="">All Communities</option>
											{
												community_config.CATEGORIES.map(cat => {
													return (
															<option value={cat} key={"search-" + cat}
																			title={community_config.TOOL_TIPS[cat]}
															>{cat}</option>
													);
												})
											}
										</select></form>
									<div className="w-form-done">
										<div>Thank you! Your submission has been received!</div>
									</div>
									<div className="w-form-fail">
										<div>Oops! Something went wrong while submitting the form.</div>
									</div>
								</div>
								{
									this.props.status === "active" ? (
											<a href="#" className="button-delete w-button" onClick={this.handleDeactivateMulti}>
												Deactivate ({this.state.selected_count})
											</a>
									) : (
											<>
												<a href="#" className="button-delete w-button" style={{color: "#2e89fe"}} onClick={this.handleActivateMulti}>
													Activate ({this.state.selected_count})
												</a>
												<a href="#" className="button-delete w-button" onClick={this.handleDeleteMulti}>
													Delete ({this.state.selected_count})
												</a>
											</>
									)
								}
							</div>
							{/*
							<div data-duration-in="300" data-duration-out="100" id="w-node-21585007d979-44cf2aa3" className="w-tabs">
								<div className="tabs-menu-4 w-tab-menu" role="tablist">
									<a data-w-tab="Tab 1"
										 className="dashboard-tab w-inline-block w-tab-link w--current"
										 tabIndex="-1" id="w-tabs-1-data-w-tab-0">
										<div className="text-block-3"><em className="italic-text-7 current">
											<i className="fas fa-portrait"></i></em></div>
									</a>
									<a data-w-tab="Tab 2" className="dashboard-tab w-inline-block w-tab-link" tabIndex="-1">
										<div className="text-block-4">
											<em className="italic-text-7 gray">
												<i className="fas fa-list"></i>
											</em>
										</div>
									</a></div>
							</div>
							*/}
						</div>

						<div className="div-20top">
							{this.props.communities[this.props.status].length > 0 ? (
											<div className="listing-grid dashboard">
												{this.props.communities[this.props.status].map((community, index) => {
													if(this.state.selected_category === "" || community.category === this.state.selected_category)
														return (
																<Thumbnail key={this.props.status + community._id} status={this.props.status}
																					 value={community} handleShowSubDlg={this.props.handleShowSubDlg}
																					 handleSelect={this.selectCommunity}
																/>
														);
													else
														return null;
												})}
											</div>)
									: (
											<div className={"w3-normal w3-text-grey"}>
												You are not the Admin for any {this.props.status} communities.
											</div>
									)
							}
						</div>
					</div>
				</div>
		);
	}
}

MyCommunities.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	communities: PropTypes.object.isRequired,
	getMyCommunities: PropTypes.func.isRequired,
	activateMultiCommunity: PropTypes.func.isRequired,
	deactivateMultiCommunity: PropTypes.func.isRequired,
	deleteMultiCommunity: PropTypes.func.isRequired,
	pickMultiCommunity: PropTypes.func.isRequired,
	clearActiveStatus: PropTypes.func.isRequired,
	clearCouponVerified: PropTypes.func.isRequired,
	clearCouponFailed: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
	communities: state.communities.my_communities,
});

export default connect(
		mapStateToProps,
		{
			getMyCommunities,
			activateMultiCommunity,
			deactivateMultiCommunity,
			deleteMultiCommunity,
			pickMultiCommunity,
			clearActiveStatus,
			clearCouponVerified,
			clearCouponFailed,
			getBillingStatus,
		}
)(MyCommunities);
