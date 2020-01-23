import React, {Component} from "react";
import {Slide} from 'react-slideshow-image';
import "../css/community-steps.css";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import FileBase from 'react-file-base64';
import {createCommunityStep2} from "../../actions/community-actions";
import FilterItemCheck from "../../components/filter-item-check";
import FilterItemRadio from "../../components/filter-item-radio";

class CommunityStep1 extends Component{
	constructor(props){
		super(props);

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

		this.filter_items = {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			times: ["Morning", "Afternoon", "Evening"],
			frequency: ["Once", "Weekly", "Bi-weekly", "Monthly", "Quarterly"],
			ages: ["All", "Elementary", "Jr.High", "High School", "Yong Adult", "20's", "30's", "40's", "50's", "60's", "70's"],
			gender: ["Co-ed", "Men", "Women"],
			parking: ["Street", "Lot", "Ramp", "Hadicap", "Drop-off Area"],
			ministries: ["Sunday School", "Youth Group", "Young Adults", "Small Groups", "Life Groups", "Support Groups", "Alpha"],
			other_services: ["Child Care", "First Communion", "Wedding's", "Marriage Prep", "Financial Peace", "Community Outreach"],
			average_attendance: 0,
			ambiance: ["Contemporary", "Traditional", "Both - Separate", "Both - Combined"],
			event_type: ["Contemporary", "Traditional", "Both - Separate", "Both - Combined"],
			support_type: ["Contemporary", "Traditional", "Both - Separate", "Both - Combined"]
		};

		const p_obj = this.props.location.state;
		this.state = {
			errors: {},

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

			days: p_obj === undefined ? "0".repeat(this.filter_items.days.length) : p_obj.obj.days,
			times: p_obj === undefined ? "0".repeat(this.filter_items.times.length) : p_obj.obj.times,
			frequency: p_obj === undefined ? "0".repeat(this.filter_items.frequency.length) : p_obj.obj.frequency,
			ages: p_obj === undefined ? "0".repeat(this.filter_items.ages.length) : p_obj.obj.ages,
			gender: p_obj === undefined ? "0".repeat(this.filter_items.gender.length) : p_obj.obj.gender,
			parking: p_obj === undefined ? "0".repeat(this.filter_items.parking.length) : p_obj.obj.parking,
			ministries: p_obj === undefined ? "0".repeat(this.filter_items.ministries.length) : p_obj.obj.ministries,
			other_services: p_obj === undefined ? "0".repeat(this.filter_items.other_services.length) : p_obj.obj.other_services,
			average_attendance: p_obj === undefined ? 0 : p_obj.obj.average_attendance,
			ambiance: p_obj === undefined ? "0".repeat(this.filter_items.ambiance.length) : p_obj.obj.ambiance,
			event_type: p_obj === undefined ? "0".repeat(this.filter_items.event_type.length) : p_obj.obj.event_type,
			support_type: p_obj === undefined ? "0".repeat(this.filter_items.support_type.length) : p_obj.obj.support_type
		};

		this.clickSubmit = this.clickSubmit.bind(this);
		this.onSubmitCommunity = this.onSubmitCommunity.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	getDaysInfo = (checks) => {
		this.setState({days: checks})
	};
	getTimesInfo = (checks) => {
		this.setState({times: checks})
	};
	getFrequencyInfo = (checks) => {
		this.setState({frequency: checks})
	};
	getAgesInfo = (checks) => {
		this.setState({ages: checks})
	};
	getGenderInfo = (checks) => {
		this.setState({gender: checks})
	};
	getParkingInfo = (checks) => {
		this.setState({parking: checks})
	};
	getMinistriesInfo = (checks) => {
		this.setState({ministries: checks})
	};
	getOtherServicesInfo = (checks) => {
		this.setState({other_services: checks})
	};
	getAmbianceInfo = (checks) => {
		this.setState({ambiance: checks})
	};
	getEventTypeInfo = (checks) => {
		this.setState({event_type: checks})
	};
	getSupportTypeInfo = (checks) => {
		this.setState({support_type: checks})
	};

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	getBaseFile(files){
		this.setState({
			pictures: [
				...this.state.pictures,
				files.base64.toString()
			],
		});
	}

	clickSubmit(e){
		e.preventDefault();
		this.onSubmitCommunity();
	}

	onSubmitCommunity(){
		// saved the information into local storage to be submitted on to server.
		const info_1 = {
			community_name: this.state.community_name,
			category: this.state.category,
			address: this.state.address,
			pictures: this.state.pictures,
			community_contact: this.state.community_contact,
			phone: this.state.phone,
			email: this.state.email,
			facebook: this.state.facebook,
			instagram: this.state.instagram,
			vimeo: this.state.vimeo,
			youtube: this.state.youtube,
			podcast: this.state.podcast,
			twitter: this.state.twitter,
			about: this.state.about,
		};

		const info_2 = {
			days: this.state.days,
			times: this.state.times,
			frequency: this.state.frequency,
			ages: this.state.ages,
			gender: this.state.gender,
			parking: this.state.parking,
			ministries: this.state.ministries,
			other_services: this.state.other_services,
			average_attendance: this.state.average_attendance,
			ambiance: this.state.ambiance,
			event_type: this.state.event_type,
			support_type: this.state.support_type
		};

		this.props.createCommunityStep2(this.props.location.state === undefined, this.props.auth.user.email, info_1, info_2, this.props.history);
	};

	render(){
		// console.log(this.state.picture);
		return (
			<div>
				<main className="steps-body">
					<div className="container-inline">
						<h3 className="header3 w3-row">
							<span className="w3-col s12 m4 l2">
								<Link to="/dashboard" className="w3-button cancel">Cancel</Link>
							</span>
							<span className="w3-col s12 m4 l8 w3-center title">
								{this.props.location.state === undefined ?
									"New Community" : "Edit: " + this.props.location.state.obj.community_name
								}

							</span>
							<span className="w3-col s12 m4 l2">
								<Link to="#" className="w3-button w3-right save" onClick={this.onSubmitCommunity}>Save and Close</Link>
							</span>
						</h3>
						<div className="w-form-done">
							<div>Thank you! Your submission has been received!</div>
						</div>
						<div className="w-form-fail"
							 style={{display: this.state.errors.msg_community !== undefined ? "block" : "none"}}>
							{this.state.errors.msg_community}
						</div>
						<div className="info-body w3-row">
							<div className="left-part w3-half">
								<div>
									{
										this.state.pictures.length > 0 ? (
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
											: (
												<img
													className={"community-picture" + (this.state.pictures.length > 0 ? "" : " w3-opacity-max")}
													alt="Community" title="Community pictures"
													src={this.state.picture ? this.state.picture : "/img/community-default.jpg"}/>
											)
									}
									<FileBase type="file" className="upload-button w-button"
											  multiple={false} onDone={this.getBaseFile.bind(this)} height="38"/>
									{false ? (
										<Link to="#" className="upload-button w-button">
											Upload a Profile Picture
										</Link>
									) : null}
									<div className="basic-info"
										 title={this.props.location.state !== undefined ? "These infos cannot be modified." : ""}>
										<input type="text" className="form-input communityname w-input" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Community name"
											   id="community_name"
											   value={this.state.community_name}
											   disabled={this.props.location.state !== undefined}
											   required=""/>
										<select className="form-select category w-select"
												onChange={this.onChange}
												id="category"
												defaultValue={this.state.category}
												disabled={this.props.location.state !== undefined}
												required="">
											<option value="">Category...</option>
											<option value="Church"> Church</option>
											<option value="Young Adult Group"> Young Adult Group</option>
											<option value="Youth Group"> Youth Group</option>
										</select>
										<input type="text" className="form-input w-input social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/icon/icon-address.svg')"}}
											   onChange={this.onChange}
											   placeholder="Address or City"
											   id="address"
											   value={this.state.address}
											   disabled={this.props.location.state !== undefined}
											   required=""/>
									</div>
								</div>
							</div>
							<div className="right-part w3-half">
								<form onSubmit={this.clickNext}
									  id="wf-form-New-Community" name="wf-form-New-Community"
									  data-name="New Community" className="form1">
									<div className="flexdiv-left labels">
										<h4 className="form-header">About</h4>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<textarea
										onChange={this.onChange}
										placeholder="Tell visitors more about your community such as who you are, when you meet, what to expect, or anything else you'd like them to know!"
										maxLength="5000"
										id="about" required=""
										value={this.state.about}
										className="textarea w-input">
									</textarea>
									<div className="flexdiv-left labels">
										<h4 className="form-header">Links and Resources</h4>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<div className="input-div w3-row">
										<input type="url" className="form-input w-input w3-half social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/social/icon-facebook.svg')"}}
											   onChange={this.onChange}
											   placeholder="Facebook page link"
											   value={this.state.facebook}
											   id="facebook"/>
										<input type="url" className="form-input w-input w3-half social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/social/icon-instagram.svg')"}}
											   onChange={this.onChange}
											   placeholder="Instagram username"
											   value={this.state.instagram}
											   id="instagram"/>
										<input type="url" className="form-input w-input w3-half social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/social/icon-vimeo.svg')"}}
											   onChange={this.onChange}
											   placeholder="Vimeo link"
											   value={this.state.vimeo}
											   id="vimeo"/>
										<input type="url" className="form-input w-input w3-half social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/social/icon-youtube.svg')"}}
											   onChange={this.onChange}
											   placeholder="Youtube link"
											   value={this.state.youtube}
											   id="youtube"/>
										<input type="url" className="form-input w-input w3-half social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/social/icon-podcast.svg')"}}
											   onChange={this.onChange}
											   placeholder="Podcast link"
											   value={this.state.podcast}
											   id="podcast"/>
										<input type="url" className="form-input w-input w3-half social-input" maxLength="256"
											   style={{backgroundImage: "url('/img/social/icon-twitter.svg')"}}
											   onChange={this.onChange}
											   placeholder="Twitter handle"
											   value={this.state.twitter}
											   id="twitter"/>
									</div>
									<div className="flexdiv-left labels">
										<h4 className="form-header">Community Contact</h4>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<div className="input-div w3-row">
										<input type="text" className="form-input w-input social-input w3-col l12" maxLength="256"
											   style={{backgroundImage: "url('/img/icon/icon-contact.svg')"}}
											   onChange={this.onChange}
											   placeholder="Contact name"
											   id="community_contact"
											   value={this.state.community_contact}
											   required=""/>
										<input type="tel" className="form-input w-input social-input w3-half" maxLength="256"
											   style={{backgroundImage: "url('/img/icon/icon-phone.svg')"}}
											   onChange={this.onChange}
											   placeholder="Phone"
											   value={this.state.phone}
											   id="phone"/>
										<input type="email" className="form-input w-input social-input w3-half" maxLength="256"
											   style={{backgroundImage: "url('/img/icon/icon-email.svg')"}}
											   onChange={this.onChange}
											   placeholder="Email"
											   value={this.state.email}
											   id="email"/>
									</div>
									<h4 className="form-header">More Info</h4>
									<div className="input-div">
										<FilterItemCheck filterTitle="Day(s)" filterName="days"
														 send={this.getDaysInfo}
														 value={this.state.days}
														 items={this.filter_items.days}/>
										<FilterItemCheck filterTitle="Time(s)" filterName="times"
														 send={this.getTimesInfo}
														 value={this.state.times}
														 items={this.filter_items.times}/>
										<FilterItemRadio filterTitle="Frequency" filterName="frequency"
														 send={this.getFrequencyInfo}
														 value={this.state.frequency}
														 items={this.filter_items.frequency}/>
										<FilterItemCheck filterTitle="Age(s)" filterName="ages"
														 send={this.getAgesInfo}
														 value={this.state.ages}
														 items={this.filter_items.ages}/>
										<FilterItemRadio filterTitle="Gender" filterName="gender"
														 send={this.getGenderInfo}
														 value={this.state.gender}
														 items={this.filter_items.gender}/>
										<FilterItemCheck filterTitle="Parking" filterName="parking"
														 send={this.getParkingInfo}
														 value={this.state.parking}
														 items={this.filter_items.parking}/>
										<FilterItemCheck filterTitle="Ministries" filterName="ministries"
														 send={this.getMinistriesInfo}
														 value={this.state.ministries}
														 items={this.filter_items.ministries}/>
										<FilterItemCheck filterTitle="Other Services" filterName="other_services"
														 send={this.getOtherServicesInfo}
														 value={this.state.other_services}
														 items={this.filter_items.other_services}/>
										<div className="attendance-div">
											<div className="flexdiv-left labels">
												<label className="filter-label">Average Attendance</label>
												<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
											</div>
											<input type="number" className="attendance-input w-input"
												   id="average_attendance"
												   onChange={this.onChange}
												   min={"0"}
												   value={this.state.average_attendance}
												   placeholder="0"/>
										</div>
										<FilterItemRadio filterTitle="Ambiance" filterName="ambiance"
														 send={this.getAmbianceInfo}
														 value={this.state.ambiance}
														 items={this.filter_items.ambiance}/>
										<FilterItemRadio filterTitle="Event Type" filterName="event_type"
														 send={this.getEventTypeInfo}
														 value={this.state.event_type}
														 items={this.filter_items.event_type}/>
										<FilterItemRadio filterTitle="Support Type" filterName="support_type"
														 send={this.getSupportTypeInfo}
														 value={this.state.support_type}
														 items={this.filter_items.support_type}/>
									</div>
									<input type="submit" value="Create" data-wait="Please wait..."
										   className="form-submit create w-button w3-hide"/>
								</form>
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}
}

CommunityStep1.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
//	createCommunityStep1: PropTypes.func.isRequired,
	createCommunityStep2: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{
//		createCommunityStep1,
		createCommunityStep2
	}
)(CommunityStep1);
