import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import {Link} from "react-router-dom";
import FacebookLogin from 'react-facebook-login';
import {GoogleLogin} from 'react-google-login';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser, loginGoogleUser} from "../actions/auth-actions";
import config from '../auth-config.json';

class LoginPopup extends Component{
	constructor(props){
		super(props);
		this.state = {
			email: "",
			password: "",
			errors: {}
		};
	}

	componentDidMount(){
		// If logged in and user navigates to Login page, should redirect them to dashboard
		if(this.props.auth.isAuthenticated){
			this.props.history.push("/dashboard");
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.auth.isAuthenticated){
			this.props.history.push("/dashboard"); // push user to dashboard when they login
		}
		if(nextProps.errors){
			this.setState({
				errors: nextProps.errors
			});
		}
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	/**
	 * when click the login button, call axios with email and password.
	 * @param e
	 */
	onSubmit = e => {
		e.preventDefault();
		const userData = {
			email: this.state.email,
			password: this.state.password
		};
		// since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
		this.props.loginUser(userData);
	};

	onFailure = (error) => {
		console.log(error);
	};

	/**
	 * get social token from google developer server
	 * @param response
	 */
	googleResponse = response => {
		const tokenBlob = new Blob(
			[JSON.stringify({access_token: response.accessToken}, null, 2)],
			{type: 'application/json'}
		);

		//console.log(response.accessToken);

		const userData = {
			social_token: response.accessToken,
		};

		this.props.loginGoogleUser(userData);
	};

	facebookResponse = response => {

	};

	render(){
		const {errors} = this.state;
		const err_msg = ""
			+ (errors.email !== undefined ? errors.email + ". " : "")
			+ (errors.emailnotfound !== undefined ? errors.emailnotfound + ". " : "")
			+ (errors.password !== undefined ? errors.password + ". " : "")
			+ (errors.passwordincorrect !== undefined ? errors.passwordincorrect + ". " : "");
		const is_error = err_msg.length > 0;

		return (
			<main>
				<div className="sign-body">
					<div className="div-block-63">
						<div className="div-block-38">
							<div className="header1-div gradient shadow">
								<h3 className="header3 center">Welcome back!</h3>
							</div>
							<div>
								<div className="form-div1">
									<div className="form-block1 w-form">
										<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
											  name="wf-form-Registration"
											  data-name="Registration" className="form1">
											<div className="form-row">
												<div className="input-div gradient">
													<input type="email"
														   className="form-input center w-input-sign"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.email}
														   id="email"
														   placeholder="Email"
														   required=""/>
												</div>
											</div>
											<div className="form-row">
												<div className="input-div gradient">
													<input type="password"
														   className="form-input center w-input-sign"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.password}
														   id="password"
														   placeholder="Password"
														   required=""/>
												</div>
											</div>
											<div className="submit-row">
												<input type="submit" value="Sign In"
													   data-wait="Please wait..."
													   className="form-submit round w-button-sign"/>
											</div>
										</form>
										<div className="w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="w-form-fail" style={{display: is_error ? "block" : "none"}}>
											{err_msg}
										</div>
									</div>
									<div className="div-block-58"><p className="fineprint">
										<Link
											to="/forgot-password"><span
											className="form-link termsofuse">Lost Password</span></Link></p></div>
								</div>
							</div>
							<div>
								<div className="strikethrough-div">
									<div className="or-div"><h4 className="or-text">or</h4></div>
								</div>
								<div className="container-subdiv">
									<div className="sdk-div">
										<GoogleLogin
											clientId={config.GOOGLE_CLIENT_ID}
											buttonText="Sign up with Google"
											onSuccess={this.googleResponse}
											onFailure={this.onFailure}/>
										<FacebookLogin
											appId={config.FACEBOOK_APP_ID}
											autoLoad={false}
											fields="name,email,picture"
											callback={this.facebookResponse}/>
									</div>
								</div>
							</div>
						</div>
						<div className="div-block-46">
							<h1 className="heading-11">
								<Link to="/register-popup" className="link-5">
									Don't have an account yet?&nbsp;Create one for free.
								</Link>
							</h1>
						</div>
					</div>
				</div>
				<SiteFooter/>
			</main>
		);
	}
}

LoginPopup.propTypes = {
	loginUser: PropTypes.func.isRequired,
	loginGoogleUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{loginUser, loginGoogleUser}
)(LoginPopup);
