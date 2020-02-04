import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Popup from "reactjs-popup";

class ProfileContainer extends Component{
	constructor(props){
		super(props);

		this.state = {
			is_show_menu: false,
		};

		this.toggleMenu = this.toggleMenu.bind(this);
	}

	toggleMenu(){
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	render(){
		return (
			<div className="profile-container">
				<div className="containerheader-div underline">
					<div className={"profile-header-wrapper"}>
						<h5 className="profile-header">Admin Profile</h5>
						<Popup
							trigger={<i style={{cursor: "pointer"}}
										className={"fas fa-question-circle tooltip-icon"}> </i>}
							position={"right top"}>
							<div>Tell visitors more about your community...</div>
						</Popup>
					</div>
				</div>
				<div className="div-block-55">
					<div className="profpic-container">
						<div className="profpic-div">
							<img src={this.props.auth.user.pic}
								 width={"100"} height={"100"} alt="" className="image-4"/>
						</div>
					</div>
				</div>
				<div className="profile-info">
					<div data-collapse="all" data-animation="default" data-duration="400"
						 className="w-nav">
						<h3 className="community-name">
							{this.props.auth.user.fname} {this.props.auth.user.lname}
						</h3>
						<Link to="/dashboard/account" className={"w3-right"}>
							<i className={"fas fa-ellipsis-h"} style={{color: "#a1a1a1"}}> </i>
						</Link>
					</div>
					<div className="personal-info">
						<div className={"personal-info-item"} style={{backgroundImage: "url(/img/icon/icon-email.svg)"}}>
							{this.props.auth.user.admin_email}
						</div>
						<div className={"personal-info-item"} style={{backgroundImage: "url(/img/icon/icon-phone.svg)"}}>
							{this.props.auth.user.phone}
						</div>
					</div>
				</div>
				<Link to="/create-new-community" className="newcommunity-button">
					<img src={"/img/icon/icon-new.svg"} alt={"create new community"}/>
					&nbsp;&nbsp;New Community
				</Link>
			</div>
		);
	}
}

ProfileContainer.propTypes = {
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
)(ProfileContainer);
