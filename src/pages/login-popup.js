import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {GoogleLogin} from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {loginUser, loginGoogleUser, clearErrors} from "../actions/auth-actions";
import config from "../conf/config";
import SiteFooter from "../components/site-footer";

class LoginPopup extends Component{
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: "",
		};
	}

	componentDidMount(){
		this.props.clearErrors();
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

		this.props.loginUser({
			email: this.state.email,
			password: this.state.password
		}, this.props.history);
	};

	onFailure = (error) => {
		console.log(error);
	};

	/**
	 * get social token from google developer server
	 * @param response
	 */
	googleResponse = response => {
		this.props.loginGoogleUser({
			email: response.w3.U3,
			social_token: response.accessToken,
		});
	};

	facebookResponse = response => {

	};

	render(){
		return (
			<main>
				<div className="sign-body">
					<div className="div-block-63">
						<div className="div-block-38">
							<div className="header1-div gradient shadow">
								<h3 className="header3 center">Welcome back! Sign in to tour dashboard.</h3>
							</div>
							<div>
								<div className="form-div1">
									<div className="form-block1 w-form">
										<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
											  name="wf-form-Registration"
											  data-name="Registration" className="form1 w3-row">
											<div className="form-row w3-half">
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
											<div className="form-row w3-half">
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
										<div className="w-form-fail"
											 style={{display: this.props.errors.msg_login ? "block" : "none"}}>
											{this.props.errors.msg_login}
										</div>
									</div>
									<div className="div-block-58"><p className="fineprint">
										<Link
											to="/forgot-password"><span
											className="form-link termsofuse">Lost Password</span></Link></p>
									</div>
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
		)
	}
}

LoginPopup.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	clearErrors: PropTypes.func.isRequired,
	loginUser: PropTypes.func.isRequired,
	loginGoogleUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{
		clearErrors,
		loginUser,
		loginGoogleUser,
	}
)(LoginPopup);
