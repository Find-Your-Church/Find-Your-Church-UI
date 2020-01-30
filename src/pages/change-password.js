import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doChangePassword} from "../actions/auth-actions";

class ChangePassword extends Component{
	constructor(props){
		super(props);
		this.sending = false;
		this.is_error = false;
		this.key = props.location.pathname.substr(16); // 16 - length of "/changepassword/", which is URL prefix for reset.
		this.state = {
			email: "",
			errors: {},
			password: '',
			password2: '',
		};
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	componentDidMount(){
		this.sending = false;
	}

	/**
	 * when click the login button, call axios with email and password.
	 * @param e
	 */
	onSubmit = e => {
		e.preventDefault();

		if(this.state.password !== this.state.password2){
			window.alert("Password mismatch!");
		}
		else{
			this.sending = true;
			this.setState({sending: true, errors: {}});

			const userData = {
				key: this.key,
				password: this.state.password,
			};
			// since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
			this.props.doChangePassword(userData, this.props.history);
		}
		this.sending = false;
	};

	render(){
		const {errors} = this.state;
		const err_msg = ""
			+ (errors.error !== undefined ? errors.error + ". " : "");
		this.is_error = err_msg.length > 0;

		return (
			<main>
				<div className="w3-modal" style={{display: this.sending && !this.is_error ? "block" : "none"}}>
					<div className="w3-display-middle w3-text-white w3-xlarge" style={{textShadow: "0 0 4px #000, 0 0 2px #000"}}>
						<i className="fas fa-spinner fa-spin"> </i>
					</div>
				</div>
				<div className="sign-body">
					<div className="div-block-63">
						<div className="div-block-38">
							<div className="header1-div gradient shadow">
								<h3 className="header3 center">Create a new password for your account.</h3>
							</div>
							<div>
								<div className="form-div1">
									<div className="form-block1 w-form">
										<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
											  name="wf-form-Registration"
											  data-name="Registration" className="form1">
											<div className="form-row">
												<div className="input-div gradient w3-row">
													<input type="password"
														   className="form-input center w-input-sign w3-half"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.password}
														   id="password"
														   placeholder="New password"
														   required=""/>
													<input type="password"
														   className="form-input center w-input-sign w3-half"
														   maxLength="256"
														   onChange={this.onChange}
														   value={this.state.password2}
														   id="password2"
														   placeholder="Confirm password"
														   required=""/>
												</div>
											</div>
											<div className="submit-row" style={{marginTop: "11px"}}>
												<input type="submit" value="Save"
													   data-wait="Please wait..."
													   className="form-submit round w-button-sign"/>
											</div>
										</form>
										<div className="w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="w-form-fail" style={{display: this.is_error ? "block" : "none"}}>
											{err_msg}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="div-block-46">
							<h1 className="heading-11">
								<Link to="/login-popup" className="link-5">
									Back to Sign In
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

ChangePassword.propTypes = {
	resetPassword: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	doChangePassword: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{doChangePassword}
)(ChangePassword);
