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

		this.state = {
			errors: {},

			community_name: "",
			category: "",
			address: "",
			pictures: [], // array of base64-encoded strings, which each represents image.
			community_contact: "",
			phone: "",
			email: "",
			facebook: "",
			instagram: "",
			vimeo: "",
			youtube: "",
			podcast: "",
			twitter: "",
			about: "",

			days: "0".repeat(this.filter_items.days.length),
			times: "0".repeat(this.filter_items.times.length),
			frequency: "0".repeat(this.filter_items.frequency.length),
			ages: "0".repeat(this.filter_items.ages.length),
			gender: "0".repeat(this.filter_items.gender.length),
			parking: "0".repeat(this.filter_items.parking.length),
			ministries: "0".repeat(this.filter_items.ministries.length),
			other_services: "0".repeat(this.filter_items.other_services.length),
			average_attendance: 0,
			ambiance: "0".repeat(this.filter_items.ambiance.length),
			event_type: "0".repeat(this.filter_items.event_type.length),
			support_type: "0".repeat(this.filter_items.support_type.length)
		};

		this.clickSubmit = this.clickSubmit.bind(this);
		this.onSubmitCommunity = this.onSubmitCommunity.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.errors){
			this.setState({
				errors: nextProps.errors
			});
		}
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

		this.props.createCommunityStep2(this.props.auth.user.email, info_1, info_2, this.props.history);
	};

	onPrevSlide(){
		this.showDivs(this.slideIndex -= 1);
	}

	onNextSlide(){
		this.showDivs(this.slideIndex += 1);
	}

	plusDivs(n){
		this.showDivs(this.slideIndex += n);
	}

	currentDiv(e){
		this.showDivs(this.slideIndex = e.target.key);
	}

	showDivs(n){
		const len = this.state.pictures.length;
		if(n > len){
			this.slideIndex = 1
		}
		if(n < 1){
			this.slideIndex = len;
		}

		this.setState({slideIndex: this.slideIndex});
	}

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
							<span className="w3-col s12 m4 l8 w3-center title">New Community</span>
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
									<div className="basic-info">
										<input type="text" className="form-input communityname w-input" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Community name"
											   id="community_name"
											   value={this.state.community_name}
											   required=""/>
										<select className="form-select category w-select"
												onChange={this.onChange}
												id="category"
												required="">
											<option value="">Category...</option>
											<option value="Church">Church</option>
											<option value="Young Adult Group">Young Adult Group</option>
											<option value="Youth Group">Youth Group</option>
										</select>
										<input type="text" className="form-input w-input" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Address or City"
											   id="address"
											   value={this.state.address}
											   required=""/>
									</div>
								</div>
							</div>
							<div className="w3-half">
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
										<input type="url" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Facebook page link"
											   value={this.state.facebook}
											   id="facebook"/>
										<input type="url" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Instagram username"
											   value={this.state.instagram}
											   id="instagram"/>
										<input type="url" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Vimeo link"
											   value={this.state.vimeo}
											   id="vimeo"/>
										<input type="url" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Youtube link"
											   value={this.state.youtube}
											   id="youtube"/>
										<input type="url" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Podcast link"
											   value={this.state.podcast}
											   id="podcast"/>
										<input type="url" className="form-input w-input w3-half" maxLength="256"
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
										<input type="text" className="form-input w-input w3-col l12" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Community contact"
											   id="community_contact"
											   value={this.state.community_contact}
											   required=""/>
										<input type="tel" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Phone"
											   value={this.state.phone}
											   id="phone"/>
										<input type="email" className="form-input w-input w3-half" maxLength="256"
											   onChange={this.onChange}
											   placeholder="Email"
											   value={this.state.email}
											   id="email"/>
									</div>
									<h4 className="form-header">More Info</h4>
									<div className="input-div">
										<FilterItemCheck filterTitle="Day(s)" filterName="days" send={this.getDaysInfo}
														 items={this.filter_items.days}/>
										<FilterItemCheck filterTitle="Time(s)" filterName="times"
														 send={this.getTimesInfo}
														 items={this.filter_items.times}/>
										<FilterItemRadio filterTitle="Frequency" filterName="frequency"
														 send={this.getFrequencyInfo}
														 items={this.filter_items.frequency}/>
										<FilterItemCheck filterTitle="Age(s)" filterName="ages" send={this.getAgesInfo}
														 items={this.filter_items.ages}/>
										<FilterItemRadio filterTitle="Gender" filterName="gender"
														 send={this.getGenderInfo}
														 items={this.filter_items.gender}/>
										<FilterItemCheck filterTitle="Parking" filterName="parking"
														 send={this.getParkingInfo}
														 items={this.filter_items.parking}/>
										<FilterItemCheck filterTitle="Ministries" filterName="ministries"
														 send={this.getMinistriesInfo}
														 items={this.filter_items.ministries}/>
										<FilterItemCheck filterTitle="Other Services" filterName="other_services"
														 send={this.getOtherServicesInfo}
														 items={this.filter_items.other_services}/>
										<div className="attendance-div">
											<div className="flexdiv-left labels">
												<label className="filter-label">Average Attendance</label>
												<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
											</div>
											<input type="number" className="attendance-input w-input"
												   id="average_attendance"
												   onChange={this.onChange}
												   value={this.state.average_attendance}
												   placeholder="0"/>
										</div>
										<FilterItemRadio filterTitle="Ambiance" filterName="ambiance"
														 send={this.getAmbianceInfo}
														 items={this.filter_items.ambiance}/>
										<FilterItemRadio filterTitle="Event Type" filterName="event_type"
														 send={this.getEventTypeInfo}
														 items={this.filter_items.event_type}/>
										<FilterItemRadio filterTitle="Support Type" filterName="support_type"
														 send={this.getSupportTypeInfo}
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
