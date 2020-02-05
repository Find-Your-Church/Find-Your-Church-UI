import React, {Component} from "react";
import {Link} from "react-router-dom";

class SiteFooter extends Component{
	redirectURL = url => {
		window.open(url, "_blank", "width=800, height=600, location=no, toolbar=no");
	};

	render(){
		return (
			<footer className="footer-div">
				<Link to="#" className="footer-link"
					  onClick={() => this.redirectURL("mailto:support@findyourchurch.org")}>
					Support
				</Link>
				<Link to="#" className="footer-link"
					  onClick={() => this.redirectURL("mailto:hello@findyourchurch.org")}>
					Get in Touch
				</Link>
				<Link to="/make-suggestion" className="footer-link">
					Make a Suggestion
				</Link>
				<Link to="/terms-n-conditions" className="footer-link">
					Terms and Conditions
				</Link>
				<Link to="/privacy-policy" className="footer-link">
					Privacy Policy
				</Link>
				<Link to="/" className="footer-link footer-logo">
					&copy; FindYourChurch.org {new Date().getFullYear()}. All rights reserved.
				</Link>
			</footer>
		);
	}
}

export default SiteFooter;
