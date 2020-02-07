import React, {Component} from "react";
import {Link} from "react-router-dom";

class SiteFooter extends Component{
	redirectURL = url => {
		window.open(url, "_blank", "width=800, height=600, location=no, toolbar=no");
	};

	render(){
		return (
			<footer className="footer-div">
				<div className={"footer-link"}>
					<Link to="#"
						  onClick={() => this.redirectURL("mailto:support@findyourchurch.org")}>
						Support
					</Link>
				</div>
				<div className={"footer-link"}>
					<Link to="#"
						  onClick={() => this.redirectURL("mailto:hello@findyourchurch.org")}>
						Get in Touch
					</Link>
				</div>
				<div className={"footer-link"}>
					<Link to="/make-suggestion">
						Make a Suggestion
					</Link>
				</div>
				<div className={"footer-link"}>
					<Link to="/terms-n-conditions">
						Terms and Conditions
					</Link>
				</div>
				<div className={"footer-link"}>
					<Link to="/privacy-policy">
						Privacy Policy
					</Link>
				</div>
				<div className={"footer-link"}>
					<Link to="/" className="footer-logo">
						&copy; FindYourChurch.org {new Date().getFullYear()}. All rights reserved.
					</Link>
				</div>
			</footer>
		);
	}
}

export default SiteFooter;
