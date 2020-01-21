import React, {Component} from "react";
import {Link} from "react-router-dom";

class SearchBar extends Component{
	render(){
		return (
			<div className="search-form-container w-form">
				<form id="search-form" name="email-form" data-name="Email Form" className="search-form">
					<select id="field" name="field" data-name="Field"
							className="search-form-dropdown w-node-5cf6ee0e50f1-ddb46e0f w-select">
						<option value="">Category...</option>
						<option value="">Church</option>
						<option value="life_groups">Life Groups</option>
						<option value="Third">Young Adult Groups</option>
					</select>
					<select id="field-2" name="field-2" data-name="Field 2"
							className="search-form-dropdown w-node-5cf6ee0e50f2-ddb46e0f w-select">
						<option value="">Radius...</option>
						<option value="1">within 1 mile of</option>
						<option value="3">within 3 miles of</option>
						<option value="5">within 5 miles of</option>
					</select>
					<input type="search"
						   className="search-form-input w-node-5cf6ee0e50f3-ddb46e0f w-input"
						   maxLength="256" name="field-3" data-name="Field 3"
						   placeholder="315 1st Avenue SE, Minneapolis, MN 55413" id="field-3"
						   required=""/>
					<Link id="w-node-5cf6ee0e50f4-ddb46e0f" to="/search-results"
						  className="search-form-button w-button">{this.props.buttonTitle}</Link>
				</form>
				<div className="w-form-done" style={{display: "none"}}>
					<div>Thank you! Your submission has been received!</div>
				</div>
				<div className="w-form-fail" style={{display: "none"}}>
					<div>Oops! Something went wrong while submitting the form.</div>
				</div>
			</div>
		);
	}
}

export default SearchBar;
