import {Link} from "react-router-dom";
import React, {Component} from "react";

class SiteFooter extends Component{
	render(){
		return (
			<footer className="w3-center footer-div">
				<div className={"w3-bar"}>
					<Link to="#" className="w3-bar-item footer-link">
						Support
					</Link>
					<Link to="#" className="w3-bar-item footer-link">
						Get in Touch
					</Link>
					<Link to="#" className="w3-bar-item footer-link">
						Make a Suggestion
					</Link>
					<Link to="#" className="w3-bar-item footer-link">
						Terms and Conditions
					</Link>
					<Link to="#" className="w3-bar-item footer-link">
						Privacy Policy
					</Link>
					<Link to="#" className="w3-bar-item footer-link footer-logo">
						&copy; FindYourChurch.org {new Date().getFullYear()}. All rights reserved.
					</Link>
				</div>
			</footer>
		);
	}
}

export default SiteFooter;
