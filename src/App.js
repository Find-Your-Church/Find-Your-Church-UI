import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import jwt_decode from "jwt-decode";
import {Provider} from "react-redux";
import 'w3-css/w3.css';
import './App.css';
import SiteHeader from "./components/site-header";
import Home from "./pages/home";
import SearchResults from "./pages/search-results";
import LoginPopup from "./pages/login-popup";
import RegisterPopup from "./pages/register-popup";
import Dashboard from "./pages/dashboard/dashboard";
import PrivateRoute from "./components/private-route";
import setAuthToken from "./utils/setAuthToken";
import store from "./reducers/store"
import {logoutUser, setCurrentUser} from "./actions/auth-actions";
import CommunityStep1 from "./pages/dashboard/community-step1";
import CommunityStep2 from "./pages/dashboard/community-step2";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import Notfound from "./pages/notfound";

if(localStorage.jwtToken){
	// Set auth token header auth
	const token = localStorage.jwtToken;
	setAuthToken(token);
	// Decode token and get user info and exp
	const decoded = jwt_decode(token);
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));
	// Check for expired token
	const currentTime = Date.now() / 1000; // to get in milliseconds
	if(decoded.exp < currentTime){
		// Logout user
		store.dispatch(logoutUser());
		// Redirect to login
		window.location.href = "./login";
	}
}

/**
 * Main component including router.
 */
class App extends Component{
	render(){
		return (
			<Provider store={store}>
				<Router>
					<SiteHeader/>
					<Switch>
						<Route exact path="/" component={Home}/>
						<Route exact path="/search-results" component={SearchResults}/>

						<Route exact path="/login-popup" component={LoginPopup}/>
						<Route exact path="/register-popup" component={RegisterPopup}/>
						<Route exact path="/forgot-password" component={ForgotPassword}/>
						<Route path="/reset/:id?" component={ResetPassword}/>

						<Route exact path="/create-new-community" component={CommunityStep1}/>
						<Route exact path="/create-new-community-2" component={CommunityStep2}/>

						<PrivateRoute path="/dashboard" component={Dashboard}/>
						<Route component={Notfound} />
					</Switch>
				</Router>
			</Provider>
		);
	}
}

export default App;
