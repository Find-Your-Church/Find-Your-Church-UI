import React, {Component} from "react";
import "../css/community-steps.css";
import {Link, Redirect} from "react-router-dom";

class CommunityStep1 extends Component{
	constructor(props){
		super(props);

		this.state = {
			isNext: false,
		};

		this.clickNext = this.clickNext.bind(this);
	}

	clickNext(e){
		e.preventDefault();

		// save the inputted information
		console.log("saved the information into local storage to be submitted on to server.");

		// then, redirect to next page
		this.setState({
			isNext: true
		});
	}

	renderRedirect = () => {
		if (this.state.isNext) {
			return <Redirect to='/create-new-community-2' />
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
							<form onSubmit={this.clickNext}
								  id="wf-form-New-Community" name="wf-form-New-Community"
								  data-name="New Community" className="form1">
								<div className="flexdiv-left labels">
									<h4 className="form-header">Community basics</h4>
									<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
								</div>
								<div className="namecategory-div">
									<input type="text" className="form-input communityname w-input" maxLength="256"
										   name="Community-name"
										   data-name="Community name"
										   placeholder="Community name"
										   id="Community-name"
										   required=""/>
									<select className="form-select category w-select"
											id="Category"
											name="Category"
											data-name="Category"
											required="">
										<option value="">Category...</option>
										<option value="First">Church</option>
										<option value="Second">Young Adult Group</option>
										<option value="Third">Youth Group</option>
									</select>
								</div>
								<div className="input-div">
									<input type="text" className="form-input w-input" maxLength="256"
										   name="Address"
										   data-name="Address"
										   placeholder="Address or City"
										   id="Address"
										   required=""/>
								</div>
								<Link to="#" className="upload-button w-button">Upload a Profile Picture</Link>
								<div className="flexdiv-left labels">
									<h4 className="form-header">Contact Info</h4>
									<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
								</div>
								<div className="input-div">
									<input type="text" className="form-input w-input" maxLength="256"
										   name="Community-contact"
										   data-name="Community contact"
										   placeholder="Community contact"
										   id="Community-contact"
										   required=""/></div>
								<div className="input-div">
									<input type="tel" className="form-input w-input" maxLength="256"
										   name="Phone"
										   data-name="Phone"
										   placeholder="Phone"
										   id="Phone"/>
									<input type="email" className="form-input w-input" maxLength="256"
										   name="Email"
										   data-name="Email"
										   placeholder="Email"
										   id="Email"/>
								</div>
								<div className="flexdiv-left labels">
									<h4 className="form-header">Links and Resources</h4>
									<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
								</div>
								<div className="input-div">
									<input type="text" className="form-input w-input" maxLength="256"
										   name="Facebook"
										   data-name="Facebook"
										   placeholder="Facebook link"
										   id="Facebook"/>
									<input type="text" className="form-input w-input" maxLength="256"
										   name="Instagram"
										   data-name="Instagram"
										   placeholder="Instagram link"
										   id="Instagram"/>
								</div>
								<div className="input-div">
									<input type="text" className="form-input w-input" maxLength="256"
										   name="Vimeo"
										   data-name="Vimeo"
										   placeholder="Vimeo link"
										   id="Vimeo"/>
									<input type="text" className="form-input w-input" maxLength="256"
										   name="YouTube"
										   data-name="YouTube"
										   placeholder="YouTube link"
										   id="YouTube"/>
								</div>
								<div className="flexdiv-left labels">
									<h4 className="form-header">About</h4>
									<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
								</div>
								<textarea
									placeholder="Tell visitors more about your community such as who you are, when you meet, what to expect, or anything else you'd like them to know!"
									maxLength="5000" id="About" name="About" data-name="About" required=""
									className="textarea w-input">
								</textarea>
								<input type="submit" className="form-submit w-button" value="Next"
									   data-wait="Please wait..."/>
							</form>
							<div className="w-form-done">
								<div>Thank you! Your submission has been received!</div>
							</div>
							<div className="w-form-fail">
								<div>Oops! Something went wrong while submitting the form.</div>
							</div>
						</div>
						<Link to="#" className="form-link cancel">Cancel</Link>
					</div>
				</main>
			</div>
		);
	}
}

export default CommunityStep1;
