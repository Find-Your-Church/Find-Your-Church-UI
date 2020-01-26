import React, {Component} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {logoutUser} from "../../actions/auth-actions";
import '../../css/dashboard.css';
import SiteFooter from "../../components/site-footer";
import DashboardHeader from "../../components/dashboard-header";
import Admin from "./admin";
import Account from "./account";

class Dashboard extends Component{
	onLogoutClick = e => {
		e.preventDefault();
		this.props.logoutUser();
	};

	render(){
		// const {user} = this.props.auth;
		// {user.fname} {user.lname}
		// onClick={this.onLogoutClick}
		return (
			<Router>
				<DashboardHeader/>
				<Route exact path="/dashboard" component={Account}/>
				<Route path="/dashboard/admin" component={Admin}/>
				<Route path="/dashboard/account" component={Account}/>
				<SiteFooter/>
			</Router>
		);
	}
}

Dashboard.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{logoutUser}
)(Dashboard);
