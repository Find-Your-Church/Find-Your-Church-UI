import React, {Component} from "react";
import './css/home.css';
import SearchBar from "../components/search-bar";
import SiteFooter from "../components/site-footer";

/**
 *
 */
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
				<SiteFooter/>
			</main>
		);
	}
}

export default Home;
