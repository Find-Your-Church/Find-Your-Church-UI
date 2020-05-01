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
import isEmpty from "../utils/isEmpty";
import SiteHeader from "../components/site-header";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import terms_conditions from "../terms-conditions";

class RegisterPopup extends Component{
	constructor(props){
		super(props);
		this.state = {
			showedModal: false,

			fname: "",
			lname: "",
			email: "",
			password: "",
			password2: "",
			zip_code: "",
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

		let newUser = {
			fname: this.state.fname,
			lname: this.state.lname,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
			zip_code: this.state.zip_code,
			location: {lat: this.state.my_lat, lng: this.state.my_lng},
		};

		this.props.registerUser(newUser, this.props.history);
		console.log(newUser.location);
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

	showModal = () => {
		this.setState({showedModal: true})
	};

	hideModal = () => {
		this.setState({showedModal: false})
	};

	onChangeAddress = val => {
		this.setState({zip_code: val});
	};

	handleSelect = address => {
		const self = this;

		self.setState({my_address: address});

		geocodeByAddress(address)
				.then(results => getLatLng(results[0]))
				.then(latLng => {
					self.setState({my_lat: latLng.lat, my_lng: latLng.lng});
				})
				.catch(error => console.error('Error', error));
	};

	render(){
		return (
				<>
					<SiteHeader/>

					<main>
						<div className="sign-body register">
							<div className={"w3-modal modal-terms-conditions"}
									 style={{display: this.state.showedModal ? "block" : "none"}}>
								<div className={"w3-modal-content w3-card-4 w3-animate-zoom"}>
									<header className={"w3-container w3-border-bottom"}>
										<span onClick={this.hideModal} className={"w3-button w3-xxlarge w3-display-topright"}>&times;</span>
										<div className={"terms-title"}>Terms and Conditions</div>
									</header>
									<div className={"w3-container terms-conditions-content"}
											 dangerouslySetInnerHTML={{__html: terms_conditions}}>
									</div>
								</div>
							</div>
							<div className="div-block-63" style={{filter: this.state.showedModal ? "blur(5px)" : "none"}}>
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
													<div className={"input-group"}>
														<div className={"forminput-div"}>
															<label htmlFor={"fname"} className={"form-label"}>First name</label>
															<input type="text"
																		 className="form-input center  w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.fname}
																		 id="fname"
																		 style={{borderColor: this.props.errors.msg_reg_fname ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className={"forminput-div"}>
															<label htmlFor={"lname"} className={"form-label"}>Last name</label>
															<input type="text"
																		 className="form-input center  w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.lname}
																		 id="lname"
																		 style={{borderColor: this.props.errors.msg_reg_lname ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className={"forminput-div span-2"}>
															<label htmlFor={"email"} className={"form-label"}>Email</label>
															<input type="email"
																		 className="form-input center  w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.email}
																		 id="email"
																		 style={{borderColor: this.props.errors.msg_reg_email ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className={"forminput-div"}>
															<label htmlFor={"password"} className={"form-label"}>Password</label>
															<input type="password"
																		 className="form-input center  w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.password}
																		 id="password"
																		 style={{borderColor: this.props.errors.msg_reg_password ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className={"forminput-div"}>
															<label htmlFor={"password2"} className={"form-label"}>Confirm password</label>
															<input type="password"
																		 className="form-input center  w-input-sign"
																		 maxLength="256"
																		 onChange={this.onChange}
																		 value={this.state.password2}
																		 id="password2"
																		 style={{borderColor: this.props.errors.msg_reg_password2 ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																		 required=""/>
														</div>
														<div className={"forminput-div"} style={{position: "relative"}}>
															<label htmlFor={"zipcode"} className={"form-label"}>Zip code</label>
															<PlacesAutocomplete
																	value={this.state.zip_code}
																	onChange={this.onChangeAddress}
																	onSelect={this.handleSelect}
															>
																{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
																		<>
																			<input className="form-input center  w-input-sign"
																						 title={`Lat: ${this.state.my_lat}, Lng: ${this.state.my_lng}, ${this.state.my_address}`}
																						 {...getInputProps({
																							 placeholder: "",
																						 })}
																						 style={{borderColor: this.props.errors.msg_reg_zip_code ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																						 required=""/>
																			<div className={"search-address-candidates"}>
																				{loading ?
																						<div
																								className={"w3-container w3-white we-text-grey w3-padding-large"}>...Loading</div> : null}
																				{suggestions.map((suggestion) => {
																					const style = {
																						color: suggestion.active ? "#ffffff" : "#254184",
																						backgroundColor: suggestion.active ? "#41b6e6" : "#e6e6e6",
																						backgroundImage: "url('/img/icon/icon-address-fill.svg')",
																					};

																					return (
																							<div className={"address-item"}
																									 onClick={() => alert(suggestion.terms)}
																									 {...getSuggestionItemProps(suggestion, {style})}>
																								{suggestion.description}
																							</div>
																					);
																				})}
																			</div>
																		</>
																)}
															</PlacesAutocomplete>
														</div>
													</div>
													<div className="submit-row">
														<input type="submit" value="Create Account"
																	 data-wait="Please wait..."
																	 className="form-submit round w-button-sign"/>
													</div>
												</form>
												<div className="w-form-done"
														 style={{display: this.props.errors.msg_register ? "block" : "none"}}>
													{this.props.errors.msg_register}
												</div>
												<div className="w-form-fail" style={{
													display:
															(!isEmpty(this.props.errors.msg_reg_fname) ||
																	!isEmpty(this.props.errors.msg_reg_lname) ||
																	!isEmpty(this.props.errors.msg_reg_email) ||
																	!isEmpty(this.props.errors.msg_reg_password) ||
																	!isEmpty(this.props.errors.msg_reg_password2) ||
																	!isEmpty(this.props.errors.msg_reg_zip_code)) ? "block" : "none"
												}}>
													<div>{this.props.errors.msg_reg_fname}</div>
													<div>{this.props.errors.msg_reg_lname}</div>
													<div>{this.props.errors.msg_reg_email}</div>
													<div>{this.props.errors.msg_reg_password}</div>
													<div>{this.props.errors.msg_reg_password2}</div>
													<div>{this.props.errors.msg_reg_zip_code}</div>
												</div>
											</div>
										</div>
										<div className="terms-conditions">
											<span className="fineprint">By registering you are agreeing to our</span>
											<Link to="#" onClick={this.showModal} className="fineprint link">Terms and
												Conditions</Link>
										</div>
									</div>
									<div className="strikethrough-div">
										<div className="or-div"></div>
									</div>
									{/*
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
									*/}
									<div className="div-block-46">
										<h1 className="heading-11">
											<Link to="/login-popup" className="link-5">
												Already have an account? <strong>Sign In</strong>
											</Link>
										</h1>
									</div>
								</div>
							</div>
						</div>
						<SiteFooter/>
					</main>
				</>
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
