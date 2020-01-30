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
import PrivateRoute from "./components/private-route";
import setAuthToken from "./utils/setAuthToken";
import store from "./reducers/store"
import {logoutUser, setCurrentUser} from "./actions/auth-actions";
import CommunityStep from "./pages/dashboard/community-step";
import ForgotPassword from "./pages/forgot-password";
import ResetPassword from "./pages/reset-password";
import Notfound from "./pages/notfound";
import Admin from "./pages/dashboard/admin";
import Account from "./pages/dashboard/account";
import ViewCommunity from "./pages/dashboard/view-community";
import {StripeProvider} from "react-stripe-elements";
import app_config from "./conf/config";
import ChangePassword from "./pages/change-password";

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
	constructor(props){
		super(props);

		this.state = {
			stripe: null,
		}
	}

	componentDidMount(){
		if(window.Stripe){
			this.setState({stripe: window.Stripe(app_config.STRIPE_PK)});
		}
		else{
			document.querySelector("#stripe-js").addEventListener("load", () => {
				// Creat Stripe instance once Stripe.js loads
				this.setState(({stripe: window.Stripe(app_config.STRIPE_PK)}));
			});
		}
	}

	render(){
		return (
			<Provider store={store}>
				<StripeProvider stripe={this.state.stripe}>
					<Router>
						<SiteHeader/>
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route exact path="/search-results" component={SearchResults}/>

							<Route exact path="/login-popup" component={LoginPopup}/>
							<Route exact path="/register-popup" component={RegisterPopup}/>
							<Route exact path="/forgot-password" component={ForgotPassword}/>
							<Route path="/reset/:id?" component={ResetPassword}/>
							<Route path="/changepassword/:id?" component={ChangePassword}/>

							<PrivateRoute exact path="/create-new-community" component={CommunityStep}/>

							<PrivateRoute exact path="/view" component={ViewCommunity}/>
							<PrivateRoute exact path="/edit" component={CommunityStep}/>

							<PrivateRoute exact path="/dashboard" component={Admin}/>
							<PrivateRoute exact path="/dashboard/admin" component={Admin}/>
							<PrivateRoute exact path="/dashboard/account" component={Account}/>
							<Route component={Notfound}/>
						</Switch>
					</Router>
				</StripeProvider>
			</Provider>
		);
	}
}

export default App;
