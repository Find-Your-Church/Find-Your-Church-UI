import React, {Component} from "react";
import "../css/community-steps.css";
import {Link, Redirect} from "react-router-dom";

class CommunityStep2 extends Component{
	constructor(props){
		super(props);

		this.state = {
			isSubmit: false,
		};

		this.clickSubmit = this.clickSubmit.bind(this);
	}

	clickSubmit(e){
		e.preventDefault();

		// save the inputted filter information
		console.log("saved the information into local storage to be submitted on to server.");

		// then, redirect to next page
		this.setState({
			isSubmit: true
		});
	}

	renderRedirect = () => {
		if(this.state.isSubmit){
			return <Redirect to='/dashboard/admin'/>
		}
	};

	render(){
		return (
			<div>
				{this.renderRedirect()}
				<main className="steps-body">
					<div className="container-inline">
						<h3 className="header3">Create a New Community!</h3>
						<div className="form-block1 w-form">
							<form onSubmit={this.clickSubmit}
								  id="wf-form-New-Community" name="wf-form-New-Community" data-name="New Community"
								  className="form1">
								<h4 className="form-header">Filters</h4>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Day(s)</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Sunday
										<input type="checkbox" id="filter-days-sunady" name="filter-days-sunady" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Monday
										<input type="checkbox" id="filter-days-monady" name="ilter-days-monady" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Tuesday
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Wednesday
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Thursday
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Friday
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Saturday
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Time(s)</label>
										<img
											src="/img/tooltip-icon.png"
											alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Morning
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Afternoon
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Evening
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Frequency</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Once
										<input type="radio" id="filter-frequency-once" name="filter-frequency" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Weekly
										<input type="radio" id="filter-frequency-weekly" name="filter-frequency" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Bi-weekly
										<input type="radio" id="filter-frequency-biweekly" name="filter-frequency" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Monthly
										<input type="radio" id="filter-frequency-monthly" name="filter-frequency" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Quarterly
										<input type="radio" id="filter-frequency-quarterly" name="filter-frequency" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label
											className="filter-label">Age(s)</label>
										<img
											src="/img/tooltip-icon.png"
											alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">All
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Elementary
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Jr. High
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">High School
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Young Adult
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">20's
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">30's
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">40's
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">50's
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">60's
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">70's+
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Gender</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Co-ed
										<input type="radio" id="filter-gender-coed" name="filter-gender" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Men
										<input type="radio" id="filter-gender-men" name="filter-gender" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Women
										<input type="radio" id="filter-gender-women" name="filter-gender" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Parking</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Street
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Lot
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Ramp
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Hadicap
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Drop-off Area
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Ministires</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Sunday School
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Youth Group
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Young Adults
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Small Groups
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Life Groups
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Support Groups
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Alpha
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Other Services</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Child Care
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">First Communion
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Wedding's
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Marriage Prep
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Financial Peace
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
									<label className="filter-option">Community Outreach
										<input type="checkbox" id="checkbox" name="checkbox" data-name="Checkbox"/>
										<span className="filter-checkmark"></span>
									</label>
								</div>
								<div className="attendance-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Average Attendance</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<input type="number" className="attendance-input w-input" maxLength="256"
										   name="Attendance" data-name="Attendance" placeholder="0" id="Attendance"/>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Ambiance</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Contemporary
										<input type="radio" id="filter-ambiance-contemporary" name="filter-ambiance" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Traditional
										<input type="radio" id="filter-ambiance-traditional" name="filter-ambiance" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Both - Separate
										<input type="radio" id="filter-ambiance-both-separate" name="filter-ambiance" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Both - Combined
										<input type="radio" id="filter-ambiance-both-combined" name="filter-ambiance" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Event Type</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Contemporary
										<input type="radio" id="filter-event-contemporary" name="filter-event" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Traditional
										<input type="radio" id="filter-event-traditional" name="filter-event" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Both - Separate
										<input type="radio" id="filter-event-both-separate" name="filter-event" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Both - Combined
										<input type="radio" id="filter-event-both-combined" name="filter-event" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
								</div>
								<div className="filter-div">
									<div className="flexdiv-left labels">
										<label className="filter-label">Support Type</label>
										<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
									</div>
									<label className="filter-option">Contemporary
										<input type="radio" id="filter-support-contemporary" name="filter-support" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Traditional
										<input type="radio" id="filter-support-traditional" name="filter-support" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Both - Separate
										<input type="radio" id="filter-support-both-separate" name="filter-support" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
									<label className="filter-option">Both - Combined
										<input type="radio" id="filter-support-both-combined" name="filter-support" data-name="radio"/>
										<span className="filter-radiomark"></span>
									</label>
								</div>
								<input type="submit" value="Create" data-wait="Please wait..."
									   className="form-submit create w-button"/>
							</form>
							<div className="w-form-done">
								<div>Thank you! Your submission has been received!</div>
							</div>
							<div className="w-form-fail">
								<div>Oops! Something went wrong while submitting the form.</div>
							</div>
						</div>
						<Link to="/create-new-community" className="form-link cancel">Back</Link>
					</div>
				</main>
			</div>
		);
	}
}

export default CommunityStep2;
