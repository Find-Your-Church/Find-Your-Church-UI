import React from "react";
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";

const AuthToDashboard = ({component: Component, auth, ...rest}) => (
	<Route
		{...rest}
		render={props =>
			auth.isAuthenticated ? (
				<Redirect to="/dashboard"/>
			) : (
				<Component {...props} />
			)
		}
	/>
);

AuthToDashboard.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(AuthToDashboard);
