import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import "../css/login-register.css";
import {Link, withRouter} from "react-router-dom";
import {GoogleLogin} from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {registerUser, registerGoogleUser, clearErrors} from "../actions/auth-actions";
import config from "../conf/config";

class RegisterPopup extends Component{
	constructor(props){
		super(props);
		this.state = {
			fname: "",
			lname: "",
			email: "",
			password: "",
			password2: "",
			errors: {}
		};
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	componentDidMount(){
		this.props.clearErrors();
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	/**
	 * Request API to register
	 *
	 * @param e
	 */
	onSubmit = e => {
		e.preventDefault();

		const newUser = {
			fname: this.state.fname,
			lname: this.state.lname,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		};
		this.props.registerUser(newUser, this.props.history);
	};

	onFailure = (error) => {
		console.log(error);
	};

	/**
	 * get social token from google developer server
	 * @param response
	 */
	googleResponse = response => {
		const userData = {
			social_token: response.accessToken,
			google_id: response.googleId,
			fname: response.w3.ofa,
			lname: response.w3.wea,
			email: response.w3.U3,
		};

		this.props.registerGoogleUser(userData, this.props.history);
	};

	render(){
		return (
			<main>
				<div className="sign-body">
					<div className="div-block-63">
						<div className="div-block-38">
							<div className="header1-div gradient shadow">
								<h3 className="header3 center">Create a free account to access your dashboard.</h3>
							</div>
							<div>
								<div className="form-div1">
									<div className="form-block1 w-form">
										<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
											  name="wf-form-Registration"
											  data-name="Registration" className="form1">
											<div className="form-row">
												<div className="input-div gradient w3-row">
													<input type="text"
														   className="form-input center  w-input-sign w3-half"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.fname}
														   id="fname"
														   placeholder="First name"
														   required=""/>
													<input type="text"
														   className="form-input center  w-input-sign w3-half"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.lname}
														   id="lname"
														   placeholder="Last name"
														   required=""/>
												</div>
											</div>
											<div className="form-row">
												<div className="input-div gradient">
													<input type="email"
														   className="form-input center  w-input-sign"
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
														   className="form-input center  w-input-sign w3-half"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.password}
														   id="password"
														   placeholder="Password"
														   required=""/>
													<input type="password"
														   className="form-input center  w-input-sign w3-half"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.password2}
														   id="password2"
														   placeholder="Confirm password"
														   required=""/>
												</div>
											</div>
											<div className="submit-row">
												<input type="submit" value="Create Account"
													   data-wait="Please wait..."
													   className="form-submit round w-button-sign"/>
											</div>
										</form>
										<div className="w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="w-form-fail" style={{display: this.props.errors.msg_register ? "block" : "none"}}>
											{this.props.errors.msg_register}
										</div>
									</div>
								</div>
								<div className="terms-conditions">
									<span className="fineprint">By registering you are agreeing to our</span>
									<Link to="/terms-n-conditions" className="fineprint link">Terms and Conditions</Link>
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
								<Link to="/login-popup" className="link-5">
									Already have an account?&nbsp;Sign In
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

RegisterPopup.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	clearErrors: PropTypes.func.isRequired,
	registerUser: PropTypes.func.isRequired,
	registerGoogleUser: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});
export default connect(
	mapStateToProps,
	{
		clearErrors,
		registerUser,
		registerGoogleUser,
	}
)(withRouter(RegisterPopup));
