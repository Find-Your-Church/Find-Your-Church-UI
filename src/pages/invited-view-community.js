import React, {Component} from "react";
import {Slide} from 'react-slideshow-image';
import "../css/community-steps.css";
import FilterItemCheck from "../components/filter-item-check";
import FilterItemRadio from "../components/filter-item-radio";
import {Link} from "react-router-dom";
import community_config from "../conf/community-conf";
import ListMembers from "../components/list-members";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {viewCommunity} from "../actions/community-actions";

class InvitedViewCommunity extends Component{
	constructor(props){
		super(props);

		this.community_id = props.location.pathname.substr(16); // 16 - length of "/view-community/", which is URL prefix for reset.
		this.props.viewCommunity({id: this.community_id});

		this.slide_options = {
			duration: 4000,
			transitionDuration: 500,
			infinite: true,
			indicators: true,
			arrows: true,
			onChange: (oldIndex, newIndex) => {
				//console.log(`slide transition from ${oldIndex} to ${newIndex}`);
			}
		};

		const p_obj = this.props.location.state;
		this.state = {
			errors: {},
			showedMembers: false,

			community_name: p_obj === undefined ? "" : p_obj.obj.community_name,
			category: p_obj === undefined ? "" : p_obj.obj.category,
			address: p_obj === undefined ? "" : p_obj.obj.address,
			pictures: p_obj === undefined ? [] : p_obj.obj.pictures,
			community_contact: p_obj === undefined ? "" : p_obj.obj.community_contact,
			phone: p_obj === undefined ? "" : p_obj.obj.phone,
			email: p_obj === undefined ? "" : p_obj.obj.email,
			facebook: p_obj === undefined ? "" : p_obj.obj.facebook,
			instagram: p_obj === undefined ? "" : p_obj.obj.instagram,
			vimeo: p_obj === undefined ? "" : p_obj.obj.vimeo,
			youtube: p_obj === undefined ? "" : p_obj.obj.youtube,
			podcast: p_obj === undefined ? "" : p_obj.obj.podcast,
			twitter: p_obj === undefined ? "" : p_obj.obj.twitter,
			about: p_obj === undefined ? "" : p_obj.obj.about,

			days: p_obj === undefined ? "0".repeat(community_config.FILTERS.days.length) : p_obj.obj.days,
			times: p_obj === undefined ? "0".repeat(community_config.FILTERS.times.length) : p_obj.obj.times,
			frequency: p_obj === undefined ? "0".repeat(community_config.FILTERS.frequency.length) : p_obj.obj.frequency,
			ages: p_obj === undefined ? "0".repeat(community_config.FILTERS.ages.length) : p_obj.obj.ages,
			gender: p_obj === undefined ? "0".repeat(community_config.FILTERS.gender.length) : p_obj.obj.gender,
			parking: p_obj === undefined ? "0".repeat(community_config.FILTERS.parking.length) : p_obj.obj.parking,
			ministries: p_obj === undefined ? "0".repeat(community_config.FILTERS.ministries.length) : p_obj.obj.ministries,
			other_services: p_obj === undefined ? "0".repeat(community_config.FILTERS.other_services.length) : p_obj.obj.other_services,
			average_attendance: p_obj === undefined ? 0 : p_obj.obj.average_attendance,
			ambiance: p_obj === undefined ? "0".repeat(community_config.FILTERS.ambiance.length) : p_obj.obj.ambiance,
			event_type: p_obj === undefined ? "0".repeat(community_config.FILTERS.event_type.length) : p_obj.obj.event_type,
			support_type: p_obj === undefined ? "0".repeat(community_config.FILTERS.support_type.length) : p_obj.obj.support_type
		};

		this.selectTabDetails = this.selectTabDetails.bind(this);
		this.selectTabMembers = this.selectTabMembers.bind(this);
	}

	componentDidMount(){
		this.props.viewCommunity({id: this.community_id});
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	selectTabDetails(e){
		this.setState({showedMembers: false});
	}

	selectTabMembers(e){
		this.setState({showedMembers: true});
	}

	redirectURL(url){
		window.open(url, "_blank", "width=800, height=600, location=no, toolbar=no");
	}

	render(){
		console.log(this.props.community.view_community);
		const obj = this.props.community.view_community ? this.props.community.view_community : null;

		return (obj === null ? null : (
				<div>
					<main className="steps-body">
						<div className={"view-wrapper"}>
							<div className="container-inline">
								<div className="info-body w3-row">
									<h3 className="header3 w3-bar w3-margin-bottom">
										<div className="create-menu w3-bar-item w3-left">
											<Link to="/" className="w3-button cancel">Back</Link>
										</div>
										<div className="create-menu w3-bar-item w3-center">
											{this.props.community.view_community.community_name}
										</div>
									</h3>
									<div className="left-part w3-col l5">
										<div>
											{this.props.community.view_community.pictures.length > 0 ? (
													<div className="slide-container">
														<Slide {...this.slide_options}>
															{this.props.community.view_community.pictures.map((pic, index) => {
																return (
																	<div className="each-slide" key={index}>
																		<div style={{backgroundImage: `url(${pic})`}}>
																		</div>
																	</div>
																);
															})}
														</Slide>
													</div>
												)
												: (
													<img
														className={"community-picture" + (this.props.community.view_community.pictures.length > 0 ? "" : " w3-opacity-max")}
														alt="Community" title="Community pictures"
														src={this.props.community.view_community.picture ? this.props.community.view_community.picture : "/img/community-default.jpg"}/>
												)}
											<div className="basic-info">
												<div
													style={{fontWeight: "bold"}}>{this.props.community.view_community.community_name}</div>
												<div>{this.props.community.view_community.category}</div>
												<div>{this.props.community.view_community.address}</div>
											</div>
										</div>
									</div>
									<div className="right-part view w3-col l7">
										<div className={"tab w3-row w3-margin-top"}>
											<div
												className={"w3-half" + (this.props.community.view_community.showedMembers ? "" : " tab-selected")}
												onClick={this.selectTabDetails}>Details
											</div>
											<div
												className={"w3-half" + (this.props.community.view_community.showedMembers ? " tab-selected" : "")}
												onClick={this.selectTabMembers}>Admin / Members
											</div>
										</div>
										{this.props.community.view_community.showedMembers ?
											(
												<ListMembers/>
											)
											: (
												<>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels">
															<h4 className="form-header">About</h4>
															<i className={"fas fa-question-circle tooltip-icon"}> </i>
														</div>
														<div>{this.props.community.view_community.about || "..."}</div>
													</div>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels">
															<h4 className="form-header">Community Contact</h4>
															<i className={"fas fa-question-circle tooltip-icon"}> </i>
														</div>
														<div className="input-div w3-row">
															<div className="view-item w3-col l12"
																 style={{backgroundImage: "url('/img/icon/icon-contact.svg')"}}>
																{this.props.community.view_community.community_contact ||
																<span style={{color: "#aaa"}}>Contact name</span>}
															</div>
															<div className="view-item w3-half"
																 style={{backgroundImage: "url('/img/icon/icon-email.svg')"}}>
																{this.props.community.view_community.email ||
																<span style={{color: "#aaa"}}>Email</span>}
															</div>
															<div className="view-item w3-half"
																 style={{backgroundImage: "url('/img/icon/icon-phone.svg')"}}>
																{this.props.community.view_community.phone ||
																<span style={{color: "#aaa"}}>Phone</span>}
															</div>
														</div>
													</div>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels">
															<h4 className="form-header">Links and Resources</h4>
															<i className={"fas fa-question-circle tooltip-icon"}> </i>
														</div>
														<div className={"social-link-group"}>
															{community_config.SOCIALS.map(item => {
																const key_name = item.toLowerCase();
																return this.props.community.view_community[key_name] ? (
																	<Link to="#" key={item}
																		  onClick={() => this.redirectURL(this.props.community.view_community[key_name])}
																		  className={"social-link"}>
																		<img src={`/img/social/icon-${key_name}.svg`}
																			 title={item} alt={item}/>
																	</Link>
																) : null;
															})}
														</div>
													</div>
													<div className={"view-paragraph"}>
														<div className="flexdiv-left labels">
															<h4 className="form-header">More Info</h4>
															<i className={"fas fa-question-circle tooltip-icon"}> </i>
														</div>
														<div className="input-div">
															<FilterItemCheck filterTitle="Day(s)" filterName="days"
																			 value={this.props.community.view_community.days}
																			 items={community_config.FILTERS.days}/>
															<FilterItemCheck filterTitle="Time(s)" filterName="times"
																			 value={this.props.community.view_community.times}
																			 items={community_config.FILTERS.times}/>
															<FilterItemRadio filterTitle="Frequency"
																			 filterName="frequency"
																			 value={this.props.community.view_community.frequency}
																			 items={community_config.FILTERS.frequency}/>
															<FilterItemCheck filterTitle="Age(s)" filterName="ages"
																			 value={this.props.community.view_community.ages}
																			 items={community_config.FILTERS.ages}/>
															<FilterItemRadio filterTitle="Gender" filterName="gender"
																			 value={this.props.community.view_community.gender}
																			 items={community_config.FILTERS.gender}/>
															<FilterItemCheck filterTitle="Parking" filterName="parking"
																			 value={this.props.community.view_community.parking}
																			 items={community_config.FILTERS.parking}/>
															<FilterItemCheck filterTitle="Other Ministries"
																			 filterName="ministries"
																			 value={this.props.community.view_community.ministries}
																			 items={community_config.FILTERS.ministries}/>
															<FilterItemCheck filterTitle="Other Services"
																			 filterName="other_services"
																			 value={this.props.community.view_community.other_services}
																			 items={community_config.FILTERS.other_services}/>
															<div className="view-filter w3-row">
																<div className={"filter-title w3-col l4"}>
																	Average Attendance
																</div>
																{this.props.community.view_community.average_attendance ?
																	<span className={"filter-value-item"}>
																{this.props.community.view_community.average_attendance}
															</span>
																	: null}
															</div>
															<FilterItemRadio filterTitle="Ambiance"
																			 filterName="ambiance"
																			 value={this.props.community.view_community.ambiance}
																			 items={community_config.FILTERS.ambiance}/>
															<FilterItemRadio filterTitle="Event Type"
																			 filterName="event_type"
																			 value={this.props.community.view_community.event_type}
																			 items={community_config.FILTERS.event_type}/>
															<FilterItemRadio filterTitle="Support Type"
																			 filterName="support_type"
																			 value={this.props.community.view_community.support_type}
																			 items={community_config.FILTERS.support_type}/>
														</div>
													</div>
												</>
											)}
									</div>
								</div>
							</div>
						</div>
					</main>
				</div>
			)
		);
	}
}

InvitedViewCommunity.propTypes = {
	community: PropTypes.object.isRequired,
	viewCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{viewCommunity}
)(InvitedViewCommunity);
