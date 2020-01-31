import React, {Component} from "react";
import {Slide} from 'react-slideshow-image';
import "../../css/community-steps.css";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import FileBase from 'react-file-base64';
import {createCommunityStep} from "../../actions/community-actions";
import FilterItemCheck from "../../components/filter-item-check";
import FilterItemRadio from "../../components/filter-item-radio";
import community_config from "../../conf/community-conf";
import ListMembers from "../../components/list-members";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from "react-places-autocomplete";

class CommunityStep extends Component{
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

		const p_obj = this.props.location.state;
		this.state = {
			errors: {},
			showedMembers: false,
			passable: false,

			community_name: p_obj === undefined ? "" : p_obj.obj.community_name,
			category: p_obj === undefined ? "" : p_obj.obj.category,
			address: p_obj === undefined ? "" : p_obj.obj.address,
			coordinate: {
				lat: null,
				lng: null,
			},
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
		this.onSubmitCommunity = this.onSubmitCommunity.bind(this);
		this.removeSlide = this.removeSlide.bind(this);
		this.onChangeAddress = this.onChangeAddress.bind(this);
		this.fixURL = this.fixURL.bind(this);
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

	onChangeAddress = val => {
		this.setState({address: val, passable: false});
	};

	handleSelect = address => {
		const self = this;
		self.setState({address: address});
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				self.setState({coordinate: latLng, passable: true});
			})
			.catch(error => console.error('Error', error));
	};

	getBaseFile(files){
		this.setState({
			pictures: [
				...this.state.pictures,
				files.base64.toString()
			],
		});
	}

	selectTabDetails(){
		this.setState({showedMembers: false});
	}

	selectTabMembers(){
		this.setState({showedMembers: true});
	}

	fixURL(e){
		if(e.target.validity.valid)
			return;
		this.setState({[e.target.id]: "http://" + this.state[e.target.id]});
	}

	onSubmitCommunity(){
		// saved the information into local storage to be submitted on to server.
		const info_1 = {
			community_name: this.state.community_name,
			category: this.state.category,
			address: this.state.address,
			coordinate: this.state.coordinate,
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

		this.props.createCommunityStep(this.props.location.state === undefined, this.props.auth.user.id, info_1, info_2, this.props.history);
	};

	removeSlide(index){
		this.setState({pictures: this.state.pictures.filter((item, idx) => idx !== index)});
	}

	render(){
		// console.log(this.state.picture);
		return (
			<div>
				<main className="steps-body">
					<div className="container-inline">
						<h3 className="header3 w3-bar">
							<div className="create-menu w3-bar-item w3-left">
								<Link to="/dashboard" className="w3-button cancel">Back</Link>
							</div>
							<div className="create-menu w3-bar-item w3-center">
								{this.props.location.state === undefined ?
									"Create a New Community"
									: (<><span style={{color: "#888"}}>Editing</span>&nbsp;
										{this.props.location.state.obj.community_name}</>)
								}

							</div>
							<div className="create-menu w3-bar-item w3-right">
								<Link to="#" className="w3-button w3-right save"
									  onClick={this.state.passable ? this.onSubmitCommunity : null}>Save</Link>
							</div>
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
												<div id={"slider-frame"} className="slide-container">
													<Slide {...this.slide_options}>
														{this.state.pictures.map((pic, index) => {
															return (
																<div className="each-slide" key={index}>
																	<div style={{backgroundImage: `url(${pic})`}}>
																		<span className={"slide-remove w3-button"}
																			  title={"Remove this picture"}
																			  onClick={() => this.removeSlide(index)}>&times;</span>
																	</div>
																</div>
															);
														})}
													</Slide>
												</div>
											)
											: (
												<img id={"slider-frame"}
													 className={"community-picture" + (this.state.pictures.length > 0 ? "" : " w3-opacity-max")}
													 alt="Community" title="Community pictures"
													 src={this.state.picture ? this.state.picture : "/img/community-default.jpg"}/>
											)
									}
									<label className={"file-btn-container w3-button"}>
										Upload New Picture
										<FileBase id="btn-upload" type="file" className="upload-button w-button"
												  multiple={false} onDone={this.getBaseFile.bind(this)} height="38"/>
									</label>
									<div className="basic-info"
										 title={this.props.location.state !== undefined ? "These infos cannot be modified." : ""}>
										<input type="text" className="form-input communityname w-input" maxLength="50"
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
										<PlacesAutocomplete
											value={this.state.address}
											class={"w3-input social-input"}
											onChange={this.onChangeAddress}
											onSelect={this.handleSelect}
										>
											{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
												<>
													<input className="form-input w-input social-input"
														   style={{backgroundImage: "url('/img/icon/icon-address.svg')"}}
														   disabled={this.props.location.state !== undefined}
														   title={`Lat: ${this.state.coordinate.lat}, Lng: ${this.state.coordinate.lng}, ${this.state.address}`}
														   {...getInputProps({placeholder: "Address or City"})}
														   required=""/>
													<div className={"address-candidates"}>
														{loading ? <div>...loading</div> : null}
														{suggestions.map((suggestion) => {
															const style = {
																backgroundColor: suggestion.active ? "#41b6e6" : "#f8f8f8",
																backgroundImage: "url('/img/icon/icon-address-fill.svg')",
															};

															return (
																<div className={"address-item"}
																	 onClick={() => alert(suggestion.terms)}
																	 {...getSuggestionItemProps(suggestion, {style})}>
																	{suggestion.description}
																</div>
															);
														})}
													</div>
												</>
											)}
										</PlacesAutocomplete>
									</div>
								</div>
							</div>
							<div className="right-part w3-half">
								<div className={"tab w3-row"}>
									<div className={"w3-half" + (this.state.showedMembers ? "" : " tab-selected")}
										 onClick={this.selectTabDetails}>Details
									</div>
									<div className={"w3-half" + (this.state.showedMembers ? " tab-selected" : "")}
										 onClick={this.selectTabMembers}>Admin / Members
									</div>
								</div>
								{this.state.showedMembers ?
									(
										<ListMembers/>
									)
									: (
										<form
											  id="wf-form-New-Community" name="wf-form-New-Community"
											  data-name="New Community" className="form1">
											<div className={"view-paragraph"}>
												<div className="flexdiv-left labels">
													<h4 className="form-header">About</h4>
													<i className={"fas fa-question-circle tooltip-icon"}> </i>
												</div>
												<textarea
													onChange={this.onChange}
													placeholder="Tell visitors more about your community such as who you are, when you meet, what to expect, or anything else you'd like them to know!"
													maxLength="500"
													id="about" required=""
													value={this.state.about}
													className="textarea w-input">
											</textarea>
											</div>
											<div className={"view-paragraph"}>
												<div className="flexdiv-left labels">
													<h4 className="form-header">Community Contact</h4>
													<i className={"fas fa-question-circle tooltip-icon"}> </i>
												</div>
												<div className="input-div w3-row">
													<input type="text"
														   className="form-input w-input social-input w3-col l12"
														   maxLength="256"
														   style={{backgroundImage: "url('/img/icon/icon-contact.svg')"}}
														   onChange={this.onChange}
														   placeholder="Contact name"
														   id="community_contact"
														   value={this.state.community_contact}
														   required=""/>
													<input type="email"
														   className="form-input w-input social-input w3-half"
														   maxLength="256"
														   style={{backgroundImage: "url('/img/icon/icon-email.svg')"}}
														   onChange={this.onChange}
														   placeholder="Email"
														   value={this.state.email}
														   id="email"/>
													<input type="tel"
														   className="form-input w-input social-input w3-half"
														   maxLength="256"
														   style={{backgroundImage: "url('/img/icon/icon-phone.svg')"}}
														   onChange={this.onChange}
														   placeholder="Phone"
														   value={this.state.phone}
														   id="phone"/>
												</div>
											</div>
											<div className={"view-paragraph"}>
												<div className="flexdiv-left labels">
													<h4 className="form-header">Links and Resources</h4>
													<i className={"fas fa-question-circle tooltip-icon"}> </i>
												</div>
												<div className="input-div w3-row">
													{community_config.SOCIALS.map(item => {
														const key_name = item.toLowerCase();
														let link_placeholder = `${item}`;
														switch(key_name){
															case 'facebook':
																link_placeholder += " page link";
																break;
															case 'instagram':
																link_placeholder += " username";
																break;
															case 'twitter':
																link_placeholder += " handle";
																break;
															default:
																link_placeholder += " link";
														}

														return (
															<input type="url" key={key_name}
																   className="form-input w-input w3-half social-input"
																   maxLength="256"
																   onBlur={this.fixURL}
																   style={{backgroundImage: "url('/img/social/icon-" + key_name + ".svg')"}}
																   onChange={this.onChange}
																   placeholder={link_placeholder}
																   value={this.state[key_name]}
																   id={key_name}/>
														);
													})}
												</div>
											</div>
											<div className={"view-paragraph edit"}>
												<div className="flexdiv-left labels">
													<h4 className="form-header">More Info</h4>
													<i className={"fas fa-question-circle tooltip-icon"}> </i>
												</div>
												<div className="input-div">
													<FilterItemCheck filterTitle="Day(s)" filterName="days"
																	 send={this.getDaysInfo}
																	 value={this.state.days}
																	 items={community_config.FILTERS.days}/>
													<FilterItemCheck filterTitle="Time(s)" filterName="times"
																	 send={this.getTimesInfo}
																	 value={this.state.times}
																	 items={community_config.FILTERS.times}/>
													<FilterItemRadio filterTitle="Frequency" filterName="frequency"
																	 send={this.getFrequencyInfo}
																	 value={this.state.frequency}
																	 items={community_config.FILTERS.frequency}/>
													<FilterItemCheck filterTitle="Age(s)" filterName="ages"
																	 send={this.getAgesInfo}
																	 value={this.state.ages}
																	 items={community_config.FILTERS.ages}/>
													<FilterItemRadio filterTitle="Gender" filterName="gender"
																	 send={this.getGenderInfo}
																	 value={this.state.gender}
																	 items={community_config.FILTERS.gender}/>
													<FilterItemCheck filterTitle="Parking" filterName="parking"
																	 send={this.getParkingInfo}
																	 value={this.state.parking}
																	 items={community_config.FILTERS.parking}/>
													<FilterItemCheck filterTitle="Other Ministries"
																	 filterName="ministries"
																	 collapsed={true}
																	 send={this.getMinistriesInfo}
																	 value={this.state.ministries}
																	 items={community_config.FILTERS.ministries}/>
													<FilterItemCheck filterTitle="Other Services"
																	 filterName="other_services"
																	 collapsed={true}
																	 send={this.getOtherServicesInfo}
																	 value={this.state.other_services}
																	 items={community_config.FILTERS.other_services}/>
													<div className="filter-div">
														<div className="flexdiv-left labels">
															<label className="filter-label">Average Attendance</label>
														</div>
														<input type="number" className="attendance-input w-input"
															   id="average_attendance"
															   onChange={this.onChange}
															   min={"0"}
															   value={this.state.average_attendance}
															   placeholder="0"/>
													</div>
													<FilterItemRadio filterTitle="Ambiance" filterName="ambiance"
																	 collapsed={true}
																	 send={this.getAmbianceInfo}
																	 value={this.state.ambiance}
																	 items={community_config.FILTERS.ambiance}/>
													<FilterItemRadio filterTitle="Event Type" filterName="event_type"
																	 collapsed={true}
																	 send={this.getEventTypeInfo}
																	 value={this.state.event_type}
																	 items={community_config.FILTERS.event_type}/>
													<FilterItemRadio filterTitle="Support Type"
																	 filterName="support_type"
																	 collapsed={true}
																	 send={this.getSupportTypeInfo}
																	 value={this.state.support_type}
																	 items={community_config.FILTERS.support_type}/>
												</div>
												<input type="submit" value="Create" data-wait="Please wait..."
													   className="form-submit create w-button w3-hide"/>
											</div>
										</form>
									)}
							</div>
						</div>
					</div>
				</main>
			</div>
		);
	}
}

CommunityStep.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	createCommunityStep: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{
		createCommunityStep
	}
)(CommunityStep);
