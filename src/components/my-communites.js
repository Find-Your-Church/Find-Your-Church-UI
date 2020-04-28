import React, {Component} from "react";
import "../css/communities.css"
import Thumbnail from "./thumbnail";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getMyCommunities} from "../actions/community-actions";
import formatNumber from "../utils/formatNumber";
import Popup from "reactjs-popup";
import community_config from "../conf/community-conf";

class MyCommunities extends Component{
	constructor(props){
		super(props);

		this.state = {
			selected_category: "",
		};

		this.refresh = this.refresh.bind(this);

		this.refresh();
	}

	refresh(){
		this.props.getMyCommunities(this.props.auth.user.id, this.props.status === "active");
	}

	onChangeCategory = e => {
		this.setState({selected_category: e.target.value});
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
													"These are the communities that will appear in search results when they match a users search criteria."
											) : (
													"These communities will not appear in search results and are only viewable by admins and active community members. New communities are set to \"Inactive\" by default and you can create as many inactive communities as you'd like at no charge."
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
										>
											<option value="">All Communities</option>
											{
												community_config.CATEGORIES.map(cat => {
													return (
															<option value={cat} key={"search-" + cat}>{cat}</option>
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
											<a href="#" className="button-delete w-button">Deactivate (x)</a>
									) : (
											<>
												<a href="#" className="button-delete w-button" style={{color: "#2e89fe"}}>Activate (x)</a>
												<a href="#" className="button-delete w-button">Delete (x)</a>
											</>
									)
								}
							</div>
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
						</div>

						<div className="div-20top">
							{this.props.communities[this.props.status].length > 0 ? (
											<div className="listing-grid dashboard">
												{this.props.communities[this.props.status].map((community, index) => {
													if(this.state.selected_category === "" || community.category === this.state.selected_category)
														return (
																<Thumbnail key={this.props.status + index} status={this.props.status}
																					 value={community} handleShowSubDlg={this.props.handleShowSubDlg}/>
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
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
	communities: state.communities.my_communities,
});

export default connect(
		mapStateToProps,
		{getMyCommunities}
)(MyCommunities);
