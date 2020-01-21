import {Link} from "react-router-dom";
import React, {Component} from "react";

class SiteFooter extends Component{
	render() {
		return (
			<footer className="footer-div">
				<Link to="#" className="footer-link">
					&copy;FindYourChurch.org 2019. All rights reserved.
				</Link>
				<Link to="#" className="footer-link">
					Privacy Policy
				</Link>
				<Link to="#" className="footer-link">
					Terms and Conditions
				</Link>
				<Link to="#" className="footer-link">
					Support
				</Link>
				<Link to="#" className="footer-link">
					Get in Touch
				</Link>
				<Link to="#" className="footer-link">
					Make a Suggestion
				</Link>
			</footer>
		);
	}
}

export default SiteFooter;
