import React, {Component} from "react";
import {Slide} from 'react-slideshow-image';
import "../../css/community-steps.css";
import FilterItemCheck from "../../components/filter-item-check";
import FilterItemRadio from "../../components/filter-item-radio";
import {Link, Redirect} from "react-router-dom";
import community_config from "../../conf/community-conf";
import ListMembers from "../../components/list-members";
import SiteHeader from "../../components/site-header";

// import Popup from "reactjs-popup";

class ViewCommunity extends Component{
	constructor(props){
		super(props);

		this.aboutLimit = 200;

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
			community_obj: p_obj,
			is_editing: false,

			is_show_menu: false,
			showedMembers: false,

			community_name: p_obj === undefined ? "" : p_obj.obj.community_name,
			category: p_obj === undefined ? "" : p_obj.obj.category,
			address: p_obj === undefined ? "" : p_obj.obj.address,
			pictures: p_obj === undefined ? [] : p_obj.obj.pictures,
			community_contact: p_obj === undefined ? "" : p_obj.obj.community_contact,
			phone: p_obj === undefined ? "" : p_obj.obj.phone,
			email: p_obj === undefined ? "" : p_obj.obj.email,
			website: p_obj === undefined ? "" : p_obj.obj.website,
			facebook: p_obj === undefined ? "" : p_obj.obj.facebook,
			instagram: p_obj === undefined ? "" : p_obj.obj.instagram,
			vimeo: p_obj === undefined ? "" : p_obj.obj.vimeo,
			youtube: p_obj === undefined ? "" : p_obj.obj.youtube,
			twitter: p_obj === undefined ? "" : p_obj.obj.twitter,
			podcast: p_obj === undefined ? "" : p_obj.obj.podcast,
			zoom: p_obj === undefined ? "" : p_obj.obj.zoom,
			about: p_obj === undefined ? "" : p_obj.obj.about,

			showedAboutShort: true,

			days: p_obj === undefined ? "0".repeat(community_config.FILTERS.days.length) : p_obj.obj.days,
			times: p_obj === undefined ? "0".repeat(community_config.FILTERS.times.length) : p_obj.obj.times,
			frequency: p_obj === undefined ? "0".repeat(community_config.FILTERS.frequency.length) : p_obj.obj.frequency,
			hosting: p_obj === undefined || p_obj.obj.hosting === undefined ? "0".repeat(community_config.FILTERS.hosting.length) : p_obj.obj.hosting,
			ages: p_obj === undefined ? "0".repeat(community_config.FILTERS.ages.length) : p_obj.obj.ages,
			gender: p_obj === undefined ? "0".repeat(community_config.FILTERS.gender.length) : p_obj.obj.gender,
			kids_welcome: p_obj === undefined || p_obj.obj.kids_welcome === undefined ? "0".repeat(community_config.FILTERS.kids_welcome.length) : p_obj.obj.kids_welcome,
			parking: p_obj === undefined ? "0".repeat(community_config.FILTERS.parking.length) : p_obj.obj.parking,
			ministries: p_obj === undefined ? "0".repeat(community_config.FILTERS.ministries.length) : p_obj.obj.ministries,
			other_services: p_obj === undefined ? "0".repeat(community_config.FILTERS.other_services.length) : p_obj.obj.other_services,
			average_attendance: p_obj === undefined ? 0 : p_obj.obj.average_attendance,
			ambiance: p_obj === undefined ? "0".repeat(community_config.FILTERS.ambiance.length) : p_obj.obj.ambiance,
			event_type: p_obj === undefined ? "0".repeat(community_config.FILTERS.event_type.length) : p_obj.obj.event_type,
			support_type: p_obj === undefined ? "0".repeat(community_config.FILTERS.support_type.length) : p_obj.obj.support_type,

			collapsedAboutPart: true,
			collapsedContactPart: true,
			collapsedLinksPart: true,
			collapsedMorePart: true,
		};

		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
		this.selectTabDetails = this.selectTabDetails.bind(this);
		this.selectTabMembers = this.selectTabMembers.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	toggleMenu(){
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	hideMenu(){
		this.setState({is_show_menu: false});
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

	handleReadMore = () => {
		this.setState({showedAboutShort: !this.state.showedAboutShort});
	};

	toggleAboutPart = () => {
		this.setState({collapsedAboutPart: !this.state.collapsedAboutPart});
	};

	toggleContactPart = () => {
		this.setState({collapsedContactPart: !this.state.collapsedContactPart});
	};

	toggleLinksPart = () => {
		this.setState({collapsedLinksPart: !this.state.collapsedLinksPart});
	};

	toggleMorePart = () => {
		this.setState({collapsedMorePart: !this.state.collapsedMorePart});
	};

	onEditCommunity = () => {
		this.setState({is_editing: true});
	};

	render(){
		// console.log(this.state.picture);
		let aboutShort = this.state.about.substr(0, this.aboutLimit);
		let isMore = false;
		if(aboutShort.length !== this.state.about.length){
			aboutShort += "...";
			isMore = true;
		}

		return this.state.is_editing ? (
				<Redirect to={{pathname: '/edit', state: {obj: this.state.community_obj.obj}}}/>
		) : (
				<>
					<SiteHeader/>
					<div>
						<main className="steps-body">
							<h3 className="header3 w3-bar">
								<div className="create-menu w3-bar-item w3-left">
									<Link to="/dashboard" className="w3-button cancel">Back</Link>
								</div>
								<div className="create-menu w3-bar-item w3-center">
									{this.state.community_name}
								</div>
								<div className="create-menu w3-bar-item w3-right">
									<Link to="#" className="w3-button w3-right edit"
												onClick={this.onEditCommunity}>
										Edit
									</Link>
								</div>
							</h3>
							<div className={"view-wrapper"}>
								<div className="container-inline">
									<div className="info-body w3-row">
										<div className="left-part w3-col l4">
											<div style={{border: "1px solid rgba(14, 0, 25, 0.15)", borderRadius: "3px"}}>
												{this.state.pictures.length > 1 ? (
																<div className="slide-container">
																	<Slide {...this.slide_options}>
																		{this.state.pictures.map((pic, index) => {
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
														: (this.state.pictures.length > 0 ? (
																<div className="slide-container">
																	<div className="each-slide">
																		<div
																				style={{backgroundImage: `url(${this.state.pictures[0]})`}}>
																		</div>
																	</div>
																</div>
														) : (
																<img
																		className={"community-picture"}
																		alt="Community" title={this.state.community_name}
																		src={this.state.picture ? this.state.picture : "/img/default-community/5e2672d254abf8af5a1ec82c_Community-p-500.png"}/>
														))}
												<div className="basic-info view">
													<div className="listingrow view" style={{position: "relative"}}>
														<strong>{this.state.community_name}</strong>
														{/*
														<Link to="#" className={"menu-icon-3dot w3-right"}
																	onClick={this.toggleMenu}>
															<i className={"fas fa-ellipsis-h"} style={{color: "#a1a1a1"}}> </i>
														</Link>
														<nav role="navigation"
																 className="w3-animate-opacity listing-navmenu view w-nav-menu"
																 onClick={this.toggleMenu} onMouseLeave={this.hideMenu}
																 style={{display: this.state.is_show_menu ? "block" : "none"}}>
															<Link to="#" className="listing-navlink view w-nav-link">
																Request to Join
															</Link>
															<Link to="#" className="listing-navlink view w-nav-link">
																Add to Favorites
															</Link>
															<Link to="#" className="listing-navlink view w-nav-link">
																Copy Link
															</Link>
															<Link to="#" className="listing-navlink view w-nav-link">
																Share
															</Link>
															<Link to="#" className="listing-navlink view w-nav-link">
																Flag / Report
															</Link>
														</nav>
														*/}
													</div>
													<div className="listingrow view">
														{this.state.category}
													</div>
													<div className="listingrow view">
														{this.state.address}
													</div>
												</div>
											</div>
										</div>
										<div className="right-part view w3-col l8">
											<div className={"tab w3-row"}>
												<div className={"w3-col s6" + (this.state.showedMembers ? "" : " tab-selected")}
														 onClick={this.selectTabDetails}>Details
												</div>
												<div className={"w3-col s6" + (this.state.showedMembers ? " tab-selected" : "")}
														 onClick={this.selectTabMembers}>Admin
												</div>
											</div>
											{this.state.showedMembers ?
													(
															<ListMembers editable={false}/>
													)
													: (
															<div className={"w3-animate-opacity"}>
																<div className={"view-paragraph"}>
																	<div className="flexdiv-left labels" onClick={this.toggleAboutPart}>
																		<h4 className="form-header">About</h4>
																		{/*<Popup
															trigger={<i style={{cursor: "pointer"}}
																		className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"left center"}>
															<div>Tell visitors more about your community...</div>
														</Popup>*/}
																	</div>
																	<div className="input-div about part-animation"
																			 style={{display: this.state.collapsedAboutPart ? "block" : "none"}}>
																		{this.state.showedAboutShort ? (
																						<>
																							<pre>
																								{aboutShort}&nbsp;
																							</pre>
																							{isMore ? (
																									<div className={"read-more"}
																											 onClick={this.handleReadMore}>read more</div>
																							) : null}
																						</>
																				)
																				: (
																						<>
																							<pre>
																								{this.state.about}
																							</pre>
																							{isMore ? (
																									<div className={"read-more"}
																											 onClick={this.handleReadMore}>show
																										less</div>
																							) : null}
																						</>
																				)
																		}
																	</div>
																</div>
																<div className={"view-paragraph"}>
																	<div className="flexdiv-left labels" onClick={this.toggleContactPart}>
																		<h4 className="form-header">Community Contact</h4>
																		{/*<Popup
															trigger={<i style={{cursor: "pointer"}}
																		className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"left center"}>
															<div>Tell visitors more about your community...</div>
														</Popup>*/}
																	</div>
																	<div className="input-div w3-row part-animation"
																			 style={{display: this.state.collapsedContactPart ? "block" : "none"}}>
																		{this.state.community_contact ?
																				<div className="view-item w3-col l12"
																						 style={{backgroundImage: "url('/img/icon/icon-contact.svg')"}}>
																					{this.state.community_contact ||
																					<span style={{color: "#aaa"}}>Contact name</span>}
																				</div>
																				: null}
																		{this.state.email ?
																				<a href={"mailto:" + this.state.email} className="view-item w3-half"
																					 style={{backgroundImage: "url('/img/icon/icon-email.svg')"}}>
																					{this.state.email ||
																					<span style={{color: "#aaa"}}>Email</span>}
																				</a>
																				: null}
																		{this.state.phone ?
																				<a href={"tel:" + this.state.phone} className="view-item w3-half"
																					 style={{backgroundImage: "url('/img/icon/icon-phone.svg')"}}>
																					{this.state.phone ||
																					<span style={{color: "#aaa"}}>Phone</span>}
																				</a>
																				: null}
																	</div>
																</div>
																<div className={"view-paragraph"}>
																	<div className="flexdiv-left labels" onClick={this.toggleLinksPart}>
																		<h4 className="form-header">Links and Resources</h4>
																		{/*<Popup
															trigger={<i style={{cursor: "pointer"}}
																		className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"left center"}>
															<div>Tell visitors more about your community...</div>
														</Popup>*/}
																	</div>
																	<div className={"social-link-group part-animation"}
																			 style={{display: this.state.collapsedLinksPart ? "block" : "none"}}>
																		{community_config.SOCIALS.map(item => {
																			const key_name = item.toLowerCase();
																			return this.state[key_name] ? (
																					<Link to="#" key={item}
																								onClick={() => this.redirectURL(this.state[key_name])}
																								className={"social-link"}>
																						<div className={`view-link-icon ${key_name}`} title={item}/>
																					</Link>
																			) : null;
																		})}
																	</div>
																</div>
																<div className={"view-paragraph"}>
																	<div className="flexdiv-left labels" onClick={this.toggleMorePart}>
																		<h4 className="form-header">More Info</h4>
																		{/*<Popup
															trigger={<i style={{cursor: "pointer"}}
																		className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"left center"}>
															<div>Tell visitors more about your community...</div>
														</Popup>*/}
																	</div>
																	<div className="input-div part-animation"
																			 style={{display: this.state.collapsedMorePart ? "block" : "none"}}>
																		<FilterItemCheck filterTitle="Day(s)" filterName="days"
																										 value={this.state.days}
																										 items={community_config.FILTERS.days}/>
																		<FilterItemCheck filterTitle="Time(s)" filterName="times"
																										 value={this.state.times}
																										 items={community_config.FILTERS.times}/>
																		<FilterItemRadio filterTitle="Frequency" filterName="frequency"
																										 value={this.state.frequency}
																										 items={community_config.FILTERS.frequency}/>
																		<FilterItemCheck filterTitle="Hosting" filterName="hosting"
																										 value={this.state.hosting}
																										 items={community_config.FILTERS.hosting}/>
																		<FilterItemCheck filterTitle="Age(s)" filterName="ages"
																										 value={this.state.ages}
																										 items={community_config.FILTERS.ages}/>
																		<FilterItemRadio filterTitle="Gender" filterName="gender"
																										 value={this.state.gender}
																										 items={community_config.FILTERS.gender}/>
																		<FilterItemRadio filterTitle="Kids Welcome" filterName="kids_welcome"
																										 value={this.state.kids_welcome}
																										 items={community_config.FILTERS.kids_welcome}/>
																		<FilterItemCheck filterTitle="Parking" filterName="parking"
																										 value={this.state.parking}
																										 items={community_config.FILTERS.parking}/>
																		<FilterItemCheck filterTitle="Other Ministries"
																										 filterName="ministries"
																										 value={this.state.ministries}
																										 items={community_config.FILTERS.ministries}/>
																		<FilterItemCheck filterTitle="Other Services"
																										 filterName="other_services"
																										 value={this.state.other_services}
																										 items={community_config.FILTERS.other_services}/>
																		{this.state.average_attendance > 0 ?
																				<div className="view-filter w3-row">
																					<div className={"filter-title w3-col l4"}>
																						Average Attendance
																					</div>
																					{this.state.average_attendance ?
																							<span className={"filter-value-item"}>
																								{this.state.average_attendance}
																							</span>
																							: null}
																				</div>
																				: null}
																		<FilterItemRadio filterTitle="Ambiance" filterName="ambiance"
																										 value={this.state.ambiance}
																										 items={community_config.FILTERS.ambiance}/>
																		<FilterItemRadio filterTitle="Event Type"
																										 filterName="event_type"
																										 value={this.state.event_type}
																										 items={community_config.FILTERS.event_type}/>
																		<FilterItemRadio filterTitle="Support Type"
																										 filterName="support_type"
																										 value={this.state.support_type}
																										 items={community_config.FILTERS.support_type}/>
																	</div>
																</div>
															</div>
													)}
										</div>
									</div>
								</div>
							</div>
						</main>
					</div>
				</>
		);
	}
}

export default ViewCommunity;
