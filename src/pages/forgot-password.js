import React, {Component} from "react";
import SiteFooter from "../components/site-footer";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {resetPassword, changePassword} from "../actions/auth-actions";
import SiteHeader from "../components/site-header";

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
    let success = false;
    if (this.props.errors.msg_change && this.props.errors.msg_change.startsWith("Success"))
      success = true;
		return (
				<>
					<SiteHeader/>
					<main>
						<div className="w3-modal" style={{display: this.props.is_sending ? "block" : "none"}}>
							<div className="w3-display-middle w3-text-white w3-jumbo">
								<i className={"fas fa-spinner fa-spin"}/>
							</div>
						</div>
						<div className="sign-body" style={{filter: this.props.is_sending ? "blur(5px)" : "none"}}>
							<div className="div-block-63">
								<div className="div-registerform">
									<div className="div-formheaderbackground">
										<h3 className="div-formheader">
                      Lost your password?
                      <span>We'll send you a link to reset it.</span>
                    </h3>
									</div>
									<div>
										<div className="form-div1">
											<div className="form-block1">
												<form noValidate onSubmit={this.onSubmit} id="wf-form-Registration"
															name="wf-form-Registration"
															data-name="Registration" className="form1">
													<div className={"input-group"}>
														<div className={"forminput-div span-2"}>
															<label htmlFor={"email"} className={"form-label"}>Email</label>
															<input type="email"
																		 className="form-input center w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.email}
                                     placeholder="johnsmith@email.com"
																		 id="email"
																		 style={{borderBottomColor: "#e6e6e6"}}
																		 required=""/>
														</div>
													</div>
													<input type="submit" value="Send"
																 data-wait="Please wait..."
																 className="form-submit round w-button-sign"
																 style={{marginTop: "0"}}
													/>
												</form>
											</div>
										</div>
									</div>
									<div className="w-form-done" style={{display: success && this.props.errors.msg_change ? "block" : "none"}}>
										{this.props.errors.msg_change}
									</div>
									<div className="w-form-fail" style={{display: !success && this.props.errors.msg_change ? "block" : "none"}}>
										{this.props.errors.msg_change}
									</div>
									<div className="strikethrough-div">
										<div className="or-div"></div>
									</div>
								</div>
                <div className="div-block-46">
                  <span className="heading-11">
                    <Link to="/sign-in" className="link-5">
                      Return to sign in page
                    </Link>
                  </span>
                </div>
							</div>
						</div>
						<SiteFooter/>
					</main>
				</>
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
