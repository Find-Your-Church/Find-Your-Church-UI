import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo, logoutUser} from "../actions/auth-actions";
import isEmpty from "../utils/isEmpty";
import {Helmet} from "react-helmet";
import app_config from "../conf/config";

class SiteHeader extends Component{
	constructor(props){
		super(props);
		this.state = {
			showedAdminMenu: false,

		};

		this.toggleAdminMenu = this.toggleAdminMenu.bind(this);
		this.hideAdminMenu = this.hideAdminMenu.bind(this);
	}

	componentDidMount(){
		if(this.props.auth.isAuthenticated)
			this.props.getUserInfo({user_id: this.props.auth.user.id,});
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.showedAdminMenu !== this.state.showedAdminMenu){
			// this.props.history.goBack();
		}
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
		this.props.logoutUser(this.props.history);
	};

	render(){
		const is_view = this.props.location.pathname.startsWith("/view-community/");

		return (
			<div id={"main-header"}>
				{is_view ? null : (
					<Helmet>
						<title>everydaybelievers.com | Search hundres of communities in your area.</title>
						<meta name={"description"}
									content={"Search communities of everyday believers in your area. Filter by the criteria that are important to you. And connect with the community th..."}/>
					</Helmet>
				)}
				<header className={`site-header w3-bar ${this.props.for1st ? "shadow" : ""}`} style={{filter: this.props.overlayed ? "blur(4px)" : "none"}}>
					<div class="site-header-element">
						<div class="site-header-sub-element">
							<Link to={`/goto-url/${app_config.FYC_HOME_URL}`} className={"header-logo"}>
								<img className="site-logo" src={"/img/logo.png"} alt="site logo"/>
							</Link>
							{this.props.auth.isAuthenticated ? null : (
								<Link to="#" onClick={this.toggleAdminMenu}
											className={"header-3lines-menu w3-bar-item w3-right no-name-item" + (this.props.auth.isAuthenticated ? "" : " oos")}>
									{this.state.showedAdminMenu ? (
										<i className="fas fa-times"/>
									) : (
										<i className="fas fa-bars"/>
									)}
								</Link>
							)}
							{this.props.auth.isAuthenticated ? (<>
									<Link to="#" onClick={this.toggleAdminMenu}	className={"header-3lines-menu w3-bar-item w3-right arrow-down"}>
										<img src={"/img/icon-down3-purple.svg"} style={{width: "10px"}} alt={"chevron for popup menu"}/>
									</Link>
									<Link to="#" onClick={this.toggleAdminMenu} className="header-3lines-menu w3-bar-item w3-right toggle-button">
										<span className={"headerprofpic-welcome"}>
											<span className={"name-on-header"}>{this.props.auth.user.fname}</span>
										</span>
										<div className="headerprofpic-div w3-right">
											<img src={
												isEmpty(this.props.auth.user.pic) ?
													"/img/default-user.png"
													: this.props.auth.user.pic}
													alt={this.props.auth.user.fname} className="image-4"/>
										</div>
									</Link>
								</>)
								: null}

							{!this.props.auth.isAuthenticated ? (
									<div class="menu-list">
										<Link to="/sign-in"
													className={"sign-in-link w3-bar-item w3-right " + (this.props.location.pathname === "/sign-in" ? "current" : "")}>
											Sign In
										</Link>
										<Link to="/create-an-account"
													className={"sign-in-link w3-bar-item w3-right " + (this.props.location.pathname === "/create-an-account" ? "current" : "")}>
											Create an account
										</Link>
										<Link to="/search-results"
													className={"sign-in-link w3-bar-item w3-right " + (this.props.location.pathname === "/search-results" ? "current" : "")}>
											Search communities
										</Link>
										<Link to={`/goto-url/${app_config.FYC_HOME_URL}/churches-and-ministries`}
													className={"sign-in-link w3-bar-item w3-right " + (this.props.location.pathname === "/goto-url" ? "current" : "")}>
											Churches and ministries
										</Link>
										{/* <Link to="/about"
													className={"sign-in-link w3-bar-item w3-right " + (this.props.location.pathname === "/about" ? "current" : "")}>
											About
										</Link> */}
										{/*<Link to="/create-an-account" className="sign-up-link w3-bar-item w3-right">*/}
										{/*<div className={"header-link-sep w3-bar-item w3-right"} style={{margin: "15px 0", fontSize: "16px"}}>&nbsp;</div>*/}
										{/*<Link to={`/goto-url/${app_config.FYC_HOME_URL}`}*/}
										{/*			className={"home-link w3-bar-item w3-right " + (this.props.location.pathname === "/" ? "current" : "")}*/}
										{/*			style={{marginRight: "7px"}}*/}
										{/*>*/}
										{/*	Home*/}
										{/*</Link>*/}
									</div>
								)
								: null}
							</div>
					</div>
				</header>
				<div className="admin-menu w3-animate-top" onClick={this.toggleAdminMenu} onMouseLeave={this.hideAdminMenu}
						 style={{
							 display: this.state.showedAdminMenu ? "block" : "none",
						 }}>
					<nav role="navigation" className="global-navcontainer w-nav-menu w--nav-menu-open">
						{/*<Link to={`/goto-url/${app_config.FYC_HOME_URL}`} className="header-navlink w-nav-link w--nav-link-open">*/}
						{/*	Home</Link>*/}
						{this.props.auth.isAuthenticated ? (<>
							<Link to="/dashboard" className="header-navlink w-nav-link w--nav-link-open">
								Profile</Link>
							<Link to="/dashboard/account"
										className="header-navlink w-nav-link w--nav-link-open">
								Account</Link>
						</>) : null}
						{this.props.auth.isAuthenticated ? null : (<>
							<Link to="/sign-in"
										className="header-navlink w-nav-link w--nav-link-open">
								Sign In</Link>
							<Link to="/create-an-account"
										className="header-navlink w-nav-link w--nav-link-open">
								Create an Account</Link>
						</>)}
						{this.props.auth.isAuthenticated ? (<>
              <Link to="/developer-console"
                    className="header-navlink w-nav-link w--nav-link-open">
                Developer Console</Link>
              <Link to={`/goto-url/${app_config.FYC_HOME_URL}/churches-and-ministries`}
                    className="header-navlink w-nav-link w--nav-link-open">
                Help and Resources</Link>
							<Link to="#" onClick={this.onLogoutClick}
										className="header-navlink w-nav-link w--nav-link-open">
								Sign Out</Link>
						</>) : null}
					</nav>
				</div>
			</div>
		);
	}
}

SiteHeader.propTypes = {
	auth: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	logoutUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{getUserInfo, logoutUser}
)(withRouter(SiteHeader));
