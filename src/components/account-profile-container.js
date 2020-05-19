import React, {Component} from "react";
import {Link} from "react-router-dom";
import "../css/account-profile-container.css";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import isEmpty from "../utils/isEmpty";
import redirectURL from "../utils/redirectURL";

class AccountProfileContainer extends Component{
	constructor(props){
		super(props);

		this.state = {
			is_show_menu: false,
		};

		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
	}

	toggleMenu(){
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	hideMenu(){
		this.setState({is_show_menu: false});
	}

	render(){
		return (
			<div className="profile-container" style={{padding: "0", border: "none"}}>
				<div className={"profile-container-wrapper"}>
					<div className="div-block-55" style={{marginTop: "0"}}>
						<div className="profpic-container">
							<div className="profpic-div">
								<img src={isEmpty(this.props.auth.user.pic) ?
									"/img/default-user.png"
									: this.props.auth.user.pic}
									 alt="" className="image-4"/>
							</div>
						</div>
					</div>
					<div className="profile-info" style={{marginBottom: "0"}}>
						<div data-collapse="all" data-animation="default" data-duration="400"
							 className="w-nav profile-info-header">
							<h3 className="community-name">
								{this.props.auth.user.fname} {this.props.auth.user.lname}
							</h3>
							{/*
							<Link to="#" className={"profile-3dot w3-right"} onClick={this.toggleMenu}>
								<i className={"fas fa-ellipsis-h"} style={{color: "#a1a1a1"}}/>
							</Link>
							<nav role="navigation" className="w3-animate-opacity listing-navmenu w-nav-menu"
								 onMouseLeave={this.hideMenu}
								 style={{display: this.state.is_show_menu ? "block" : "none"}}>
								<Link to="/dashboard/account" className="listing-navlink w-nav-link">
									Edit
								</Link>
							</nav>
							*/}
						</div>
						<div className="personal-info">
							{isEmpty(this.props.auth.user.admin_email) ? null :
								<Link to="#" className={"members email"} title={this.props.auth.user.admin_email}
									  onClick={() => redirectURL("mailto:" + this.props.auth.user.admin_email)}>
								</Link>
							}
							{isEmpty(this.props.auth.user.phone) ? null :
								<Link to="#" className={"members phone"} title={this.props.auth.user.phone}
											onClick={() => redirectURL("tel:" + this.props.auth.user.phone)}>
								</Link>
							}
							{isEmpty(this.props.auth.user.website) ? null :
								<Link to="#" className={"members website"} title={this.props.auth.user.website}
											onClick={() => redirectURL(this.props.auth.user.website)}>
								</Link>
							}
							{isEmpty(this.props.auth.user.facebook) ? null :
								<Link to="#" className={"members facebook"} title={this.props.auth.user.facebook}
											onClick={() => redirectURL(this.props.auth.user.facebook)}>
								</Link>
							}
							{isEmpty(this.props.auth.user.twitter) ? null :
								<Link to="#" className={"members twitter"} title={this.props.auth.user.twitter}
											onClick={() => redirectURL(this.props.auth.user.twitter)}>
								</Link>
							}
							{isEmpty(this.props.auth.user.instagram) ? null :
								<Link to="#" className={"members instagram"} title={this.props.auth.user.instagram}
											onClick={() => redirectURL(this.props.auth.user.instagram)}>
								</Link>
							}
						</div>
						<div className={"info-zipcode"} title={this.props.auth.user.zip_code}>
							{this.props.auth.user.zip_code}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AccountProfileContainer.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{}
)(AccountProfileContainer);
