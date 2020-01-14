import React, {Component} from "react";
import './css/home.css';
import SearchBar from "../components/search-bar";
import {Link} from "react-router-dom";

class Home extends Component{
	render(){
		return (
			<main className="home-main">
				<div className="block-48 w3-display-container">
					<div className="search-container w3-display-middle">
						<h1 className="search-form-header">What kind of community are you looking for?</h1>
						<SearchBar buttonTitle="Search"/>
					</div>
				</div>
				<div className="block-50">
					<div className="block-60">
					</div>
				</div>
				<div className="block-51">
				</div>
				<div className="block-52">
					<div className="block-61">
					</div>
				</div>
				<div className="block-51">
				</div>
				<div className="block-52 teal">

				</div>
				<div className="footer-div">
					<Link to="#" className="footer-link">
						©FindYourChurch.org 2019. All rights reserved.
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
				</div>
			</main>
		);
	}
}

export default Home;
