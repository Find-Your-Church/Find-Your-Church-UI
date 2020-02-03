import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

class MakeSuggestionPage extends Component{
	render(){
		return (
			<main>
				<div className="sign-body">
					<div className="w3-xxlarge w3-display-middle w3-center w3-text-blue">
						survey i-frame
					</div>
				</div>
				<SiteFooter/>
			</main>
		);
	}
}

export default MakeSuggestionPage;
