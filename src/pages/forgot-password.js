import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {resetPassword} from "../actions/auth-actions";

class ForgotPassword extends Component{
	constructor(props){
		super(props);
		this.sending = false;
		this.is_error = false;
		this.state = {
			sending: false,
			email: "",
			errors: {},
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
		this.sending = true;
		this.setState({sending: true, errors: {}});
		const userData = {
			email: this.state.email,
		};
		// since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
		this.props.resetPassword(userData, this.props.history);
	};

	render(){
		const {errors} = this.state;
		const err_msg = ""
			+ (errors.email !== undefined ? errors.email + ". " : "");
		this.is_error = err_msg.length > 0;

		return (
			<main>
				<div className="w3-modal" style={{display: this.sending && !this.is_error ? "block" : "none"}}>
					<div className="w3-display-middle w3-text-white w3-xlarge" style={{textShadow: "0 0 4px #000, 0 0 2px #000"}}>
						Please wait while sending a mail...
					</div>
				</div>
				<div className="sign-body">
					<div className="div-block-63">
						<div className="div-block-38">
							<div className="header1-div gradient shadow">
								<h3 className="header3 center">We'll send you an email to reset your password!</h3>
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
											<div className="submit-row" style={{marginTop: "11px"}}>
												<input type="submit" value="Send Email"
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

ForgotPassword.propTypes = {
	resetPassword: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{resetPassword}
)(ForgotPassword);
