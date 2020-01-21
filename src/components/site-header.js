import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../actions/auth-actions";

class SiteHeader extends Component{
	constructor(props){
		super(props);
		this.state = {
			showedAdminMenu: false,
		};

		this.toggleAdminMenu = this.toggleAdminMenu.bind(this);
		this.hideAdminMenu = this.hideAdminMenu.bind(this);
	}

	toggleAdminMenu(){
		this.setState({showedAdminMenu: !this.state.showedAdminMenu});
	}

	hideAdminMenu(){
		if(this.state.showedAdminMenu)
			this.setState({showedAdminMenu: false});
	}

	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
		window.location.href = "/login-popup";
	};

	render(){
		return (
			<div>
				<header className="site-header w3-bar" onClick={this.hideAdminMenu}>
					<Link to="/">
						<img className="site-logo"
							 src="../img/logo.png"
							 srcSet="../img/logo-800.png 800w, ../img/logo-1080.png 1080w, ../img/logo-1600.png 1600w, ../img/logo-2000.png 2000w, ../img/logo-2600.png 2600w, ../img/logo.png 2732w"
							 sizes="(max-width: 479px) 144.546875px, 216.8125px" alt="site logo"/>
					</Link>

					{this.props.auth.isAuthenticated ?
						<Link to="#" onClick={this.toggleAdminMenu}
							  className="header-3lines-menu w3-bar-item w3-right"><i className="fas fa-bars"></i></Link>
						: null}
					{this.props.auth.isAuthenticated ?
						<Link to="#" onClick={this.onLogoutClick}
							  className="w3-bar-item w3-right w3-hover-text-white">Sign Out</Link>
						: null}
					{this.props.auth.isAuthenticated ?
						<Link to="/dashboard"
							  className="w3-bar-item w3-right w3-hover-text-white">Dashboard</Link>
						: null}

					{!this.props.auth.isAuthenticated ?
						<Link to="/register-popup"
							  className="sign-up-link w3-bar-item w3-right w3-text-white">Create an Account</Link>
						: null}
					{!this.props.auth.isAuthenticated ?
						< Link to="/login-popup"
							   className="w3-bar-item w3-right w3-hover-text-white">Sign In</Link>
						: null}
					<Link to="/" className="w3-bar-item w3-right w3-hover-text-white">Home</Link>
				</header>
				<div className="admin-menu w3-animate-right" onClick={this.toggleAdminMenu}
					 style={{display: this.state.showedAdminMenu ? "block" : "none"}}>
					<nav role="navigation" className="global-navcontainer w-nav-menu w--nav-menu-open"
						 style={{transform: "translateY(0px)", transition: "transform 400ms ease 0s"}}>
						<Link to="/" className="header-navlink w-nav-link w--nav-link-open">
							Home</Link>
						<Link to="/register-popup" className="header-navlink w-nav-link w--nav-link-open">
							Register</Link>
						<Link to="/login-popup" className="header-navlink w-nav-link w--nav-link-open">
							Sign In</Link>
						<Link to="#" className="header-navlink w-nav-link w--nav-link-open">
							Forgot Password</Link>
						<Link to="/dashboard" className="header-navlink w-nav-link w--nav-link-open">
							Dashboard</Link>
						<Link to="/create-new-community" className="header-navlink w-nav-link w--nav-link-open">
							New Community</Link>
						<Link to="/profile-edit" className="header-navlink w-nav-link w--nav-link-open">
							Edit Community</Link>
						<Link to="/community-profile" className="header-navlink w-nav-link w--nav-link-open">
							Community Profile</Link>
						<Link to="/subscribe" className="header-navlink w-nav-link w--nav-link-open">
							Subscribe</Link>
						<Link to="/update-subscription" className="header-navlink w-nav-link w--nav-link-open">
							Update Subscription</Link>
						<Link to="/dashboard-super-admin"
							  className="header-navlink w-nav-link w--nav-link-open">
							Account</Link>
						<Link to="/search-results" className="header-navlink w-nav-link w--nav-link-open">
							Search Results</Link>
					</nav>
				</div>
			</div>
		);
	}
}

SiteHeader.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{logoutUser}
)(SiteHeader);
