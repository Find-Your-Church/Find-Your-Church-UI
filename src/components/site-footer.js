import React, {Component} from "react";
import {Link} from "react-router-dom";
import redirectURL from "../utils/redirectURL";

class SiteFooter extends Component{
	render(){
		return (
			<footer className="footer-div">
				<div className={"footer-link"}>
					<Link to="#"
						  onClick={() => redirectURL("mailto:support@findyourchurch.org")}>
						Support
					</Link>
				</div>
				<div className={"footer-link"}>
					<Link to="#"
						  onClick={() => redirectURL("mailto:hello@findyourchurch.org")}>
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
				<div className={"footer-logo"}>
					&copy; <Link to="/">FindYourChurch.org</Link> {new Date().getFullYear()}.&nbsp;
					<span>
						 All rights reserved.
					</span>
				</div>
			</footer>
		);
	}
}

export default SiteFooter;
