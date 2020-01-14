import React, {Component} from "react";
import {Link} from "react-router-dom";

class SiteHeader extends Component{
	render(){
		return (
			<header className="site-header">
				<div className="header-body w3-bar">
					<img className="site-logo"
						 src="../img/logo.png"
						 srcSet="../img/logo-800.png 800w, ../img/logo-1080.png 1080w, ../img/logo-1600.png 1600w, ../img/logo-2000.png 2000w, ../img/logo-2600.png 2600w, ../img/logo.png 2732w"
						 sizes="(max-width: 479px) 144.546875px, 216.8125px" alt="site logo"/>
					<Link to="/register-popup"
						  className="w3-bar-item w3-right w3-hover-text-white">Sign Up</Link>
					<Link to="/login-popup"
						  className="w3-bar-item w3-right w3-hover-text-white">Sign In</Link>
					<Link to="/" className="w3-bar-item w3-right w3-hover-text-white">Home</Link>
				</div>
				<div className="header-bar">
				</div>
			</header>
		);
	}
}

export default SiteHeader;
