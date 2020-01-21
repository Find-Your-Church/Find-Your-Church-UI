import React, {Component} from "react";
import "../css/community-steps.css";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import FileBase from 'react-file-base64';
import {createCommunityStep1} from "../../actions/community-actions";

class CommunityStep1 extends Component{
	constructor(props){
		super(props);

		this.state = {
			isNext: false,
			errors: {},

			community_name: "",
			category: "",
			address: "",
			picture: "", // base64-encoded string represent image.
			community_contact: "",
			phone: "",
			email: "",
			facebook: "",
			instagram: "",
			vimeo: "",
			youtube: "",
			about: "",
		};

		this.clickNext = this.clickNext.bind(this);
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	getBaseFile(files){
		this.setState({
			// baseImage: files.base64,
			picture: files.base64.toString()
		});
	}

	clickNext(e){
		e.preventDefault();

		// saved the information into local storage to be submitted on to server.
		const info_1 = {
			community_name: this.state.community_name,
			category: this.state.category,
			address: this.state.address,
			picture: this.state.picture,
			community_contact: this.state.community_contact,
			phone: this.state.phone,
			email: this.state.email,
			facebook: this.state.facebook,
			instagram: this.state.instagram,
			vimeo: this.state.vimeo,
			youtube: this.state.youtube,
			about: this.state.about,
		};

		// invoke the action - createCommunityStep1
		this.props.createCommunityStep1(info_1, this.props.history);

		// then, redirect to next page
		this.setState({
			isNext: true,
		});
	}

	renderRedirect = () => {
		if(this.state.isNext){
			return <Redirect to='/create-new-community-2'/>
		}
	};

	render(){
		console.log(this.state.picture);
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
								</div>
								<div className="input-div">
									<input type="text" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Address or City"
										   id="address"
										   value={this.state.address}
										   required=""/>
								</div>
								<img className={"community-picture" + (this.state.picture ? "" : " w3-opacity-max")} alt="Community" src={
									this.state.picture ? this.state.picture : "/img/community-default.jpg"}/>
								<FileBase type="file" className="upload-button w-button"
										  multiple={false} onDone={this.getBaseFile.bind(this)} height="38"/>
								{false ? (
									<Link to="#" className="upload-button w-button">
										Upload a Profile Picture
									</Link>
								) : null}
								<div className="flexdiv-left labels">
									<h4 className="form-header">Contact Info</h4>
									<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
								</div>
								<div className="input-div">
									<input type="text" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Community contact"
										   id="community_contact"
										   value={this.state.community_contact}
										   required=""/></div>
								<div className="input-div">
									<input type="tel" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Phone"
										   value={this.state.phone}
										   id="phone"/>
									<input type="email" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Email"
										   value={this.state.email}
										   id="email"/>
								</div>
								<div className="flexdiv-left labels">
									<h4 className="form-header">Links and Resources</h4>
									<img src="/img/tooltip-icon.png" alt="" className="tooltip-icon"/>
								</div>
								<div className="input-div">
									<input type="url" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Facebook link"
										   value={this.state.facebook}
										   id="facebook"/>
									<input type="url" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Instagram link"
										   value={this.state.instagram}
										   id="instagram"/>
								</div>
								<div className="input-div">
									<input type="url" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="Vimeo link"
										   value={this.state.vimeo}
										   id="vimeo"/>
									<input type="url" className="form-input w-input" maxLength="256"
										   onChange={this.onChange}
										   placeholder="YouTube link"
										   value={this.state.youtube}
										   id="youtube"/>
								</div>
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

CommunityStep1.propTypes = {
	errors: PropTypes.object.isRequired,
	createCommunityStep1: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{createCommunityStep1}
)(CommunityStep1);
