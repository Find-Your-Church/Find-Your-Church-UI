import React, {Component} from "react";
import "../css/community-steps.css";
import {Link} from "react-router-dom";
import {createCommunityStep2} from "../../actions/community-actions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import FilterItemCheck from "../../components/filter-item-check";
import FilterItemRadio from "../../components/filter-item-radio";

class CommunityStep2 extends Component{
	constructor(props){
		super(props);

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

	clickSubmit(e){
		e.preventDefault();

		// saved the information into local storage to be submitted on to server.
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

		this.props.createCommunityStep2(this.props.auth.user.email, this.props.info_1, info_2, this.props.history);
	};

	render(){
		// console.log(this.state.errors.msg_community);
		return (
			<div>
				<main className="steps-body">
					<div className="container-inline">
						<h3 className="header3">Create a New Community!</h3>
						<div className="form-block1 w-form">
							<form onSubmit={this.clickSubmit}
								  id="wf-form-New-Community" name="wf-form-New-Community" data-name="New Community"
								  className="form1">
								<h4 className="form-header">Filters</h4>
								<FilterItemCheck filterTitle="Day(s)" filterName="days" send={this.getDaysInfo}
												 items={this.filter_items.days}/>
								<FilterItemCheck filterTitle="Time(s)" filterName="times" send={this.getTimesInfo}
												 items={this.filter_items.times}/>
								<FilterItemRadio filterTitle="Frequency" filterName="frequency"
												 send={this.getFrequencyInfo}
												 items={this.filter_items.frequency}/>
								<FilterItemCheck filterTitle="Age(s)" filterName="ages" send={this.getAgesInfo}
												 items={this.filter_items.ages}/>
								<FilterItemRadio filterTitle="Gender" filterName="gender" send={this.getGenderInfo}
												 items={this.filter_items.gender}/>
								<FilterItemCheck filterTitle="Parking" filterName="parking" send={this.getParkingInfo}
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

								<input type="submit" value="Create" data-wait="Please wait..."
									   className="form-submit create w-button"/>
							</form>
							<div className="w-form-done">
								<div>Thank you! Your submission has been received!</div>
							</div>
							<div className="w-form-fail w3-text-red w3-small" style={{display: this.state.errors.msg_community !== undefined ? "block" : "none"}}>
								{this.state.errors.msg_community}
							</div>
						</div>
						<Link to="/create-new-community" className="form-link cancel">Back</Link>
					</div>
				</main>
			</div>
		);
	}
}

CommunityStep2.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	info_1: PropTypes.object.isRequired,
	createCommunityStep2: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	info_1: state.communities.info_1,
});

export default connect(
	mapStateToProps,
	{createCommunityStep2}
)(CommunityStep2);
