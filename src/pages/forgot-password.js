import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {resetPassword, changePassword} from "../actions/auth-actions";

class ForgotPassword extends Component{
	constructor(props){
		super(props);

		this.state = {
			email: "",
		};
	}

	onChange = e => {
		this.setState({[e.target.id]: e.target.value});
	};

	/**
	 * when click the button, call axios.
	 * @param e
	 */
	onSubmit = e => {
		e.preventDefault();

		this.props.changePassword({
			email: this.state.email,
		}, this.props.history);
	};

	render(){
		return (
			<main>
				<div className="w3-modal" style={{display: this.props.is_sending ? "block" : "none"}}>
					<div className="w3-display-middle w3-text-white w3-jumbo">
						<i className={"fas fa-spinner fa-spin"}> </i>
					</div>
				</div>
				<div className="sign-body" style={{filter: this.props.is_sending ? "blur(5px)" : "none"}}>
					<div className="div-block-63">
						<div className="div-block-38">
							<div className="header1-div gradient shadow">
								<h3 className="header3 center">We'll send you an email to reset your password!</h3>
							</div>
							<div>
								<div className="form-div1">
									<div className="form-block1">
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
											<div className="submit-row">
												<input type="submit" value="Send Email"
													   data-wait="Please wait..."
													   className="form-submit round w-button-sign"/>
											</div>
										</form>
										<div className="w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="w-form-fail" style={{display: this.props.errors.msg_change ? "block" : "none"}}>
											{this.props.errors.msg_change}
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
	is_sending: PropTypes.bool.isRequired,
	errors: PropTypes.object.isRequired,
	resetPassword: PropTypes.func.isRequired,
	changePassword: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	is_sending: state.auth.is_sending,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{resetPassword, changePassword}
)(ForgotPassword);
