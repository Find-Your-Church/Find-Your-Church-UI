import React, {Component} from "react";
import {Link} from "react-router-dom";

class SiteFooter extends Component{
	redirectURL = url => {
		window.open(url, "_blank", "width=800, height=600, location=no, toolbar=no");
	};

	render(){
		return (
			<footer className="w3-center footer-div">
				<div className={"w3-bar"}>
					<Link to="#" className="w3-bar-item footer-link" onClick={() => this.redirectURL("mailto:support@findyourchurch.org")}>
						Support
					</Link>
					<Link to="#" className="w3-bar-item footer-link" onClick={() => this.redirectURL("mailto:hello@findyourchurch.org")}>
						Get in Touch
					</Link>
					<Link to="/make-suggestion" className="w3-bar-item footer-link">
						Make a Suggestion
					</Link>
					<Link to="/terms-n-conditions" className="w3-bar-item footer-link">
						Terms and Conditions
					</Link>
					<Link to="/privacy-policy" className="w3-bar-item footer-link">
						Privacy Policy
					</Link>
					<Link to="/" className="w3-bar-item footer-link footer-logo">
						&copy; FindYourChurch.org {new Date().getFullYear()}. All rights reserved.
					</Link>
				</div>
			</footer>
		);
	}
}

export default SiteFooter;
