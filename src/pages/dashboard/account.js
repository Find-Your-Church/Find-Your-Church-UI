import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {CardElement, injectStripe} from "react-stripe-elements";
import {getUserInfo, updateUserInfo, verifyEmail} from "../../actions/auth-actions";
import {
	getMyCommunities,
	getBillingStatus,
	registerCard,
	getPlan,
	setSearchCriteria
} from "../../actions/community-actions";
import SiteFooter from "../../components/site-footer";
import getNextMonth from "../../utils/getNextMonth";
import '../../css/account.css';
import "../../css/stripe-style.css";
import formatNumner from "../../utils/formatNumber";
import showAmount from "../../utils/showAmount";
import Popup from "reactjs-popup";
import isEmpty from "../../utils/isEmpty";
import FileBase from "react-file-base64";
import config from "../../conf/config";
import community_config, {INIT_FILTERS} from "../../conf/community-conf";
import AccountProfileContainer from "../../components/account-profile-container";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import Tooltip from "rmc-tooltip/es";

const cardStyle = {
	base: {
		color: "#32325d",
		"::placeholder": {
			color: "#aab7c4"
		}
	},
	invalid: {
		color: "#fa755a",
		iconColor: "#fa755a"
	}
};

class Account extends Component{
	constructor(props){
		super(props);

		this.props.getUserInfo({
			user_id: this.props.auth.user.id,
		});
		let {user} = props.auth;

		this.tmr = null; // timer for displaying the error message

		this.props.getMyCommunities(this.props.auth.user.id, true);
		this.props.getMyCommunities(this.props.auth.user.id, false);

		this.props.getBillingStatus({
			user_id: this.props.auth.user.id,
		}, this.props.history);

		this.previewCriteria = {
			owner: null,
			category: '',
			radius: null,
			address: '',
			lat: 44.989999,
			lng: -93.256088,
			filter: {
				...INIT_FILTERS,
			}
		};

		this.state = {
			showSizeError: false,
			editingUserName: false,
			editingAdminEmail: false,
			editingEmail: false,
			editingPassword: false,
			editingPhone: false,
			editingZipCode: false,
			editingRefCode: false,
			editing_card: false,
			errors: {},

			is_invalid_phone: false,

			user_admin_email: user.admin_email ? user.admin_email : user.email,
			user_email: user.email,
			user_pic: user.pic,
			user_email_verified: user.email_verified,
			user_email_verified_at: user.email_verified_at,
			user_fname: user.fname,
			user_lname: user.lname,
			user_phone: user.phone,
			user_registered_at: user.registered_at,
			user_password: "",
			user_password2: "",
			user_zip_code: user.zip_code === undefined ? "" : user.zip_code,
			user_location: user.location === undefined ? {lat: null, lng: null} : user.location,
			user_ref_code: user.ref_code === undefined ? "" : user.ref_code,

			name_on_card: this.props.auth.user.billing_info ? this.props.auth.user.billing_info.sources.data[0].name : "",

			frameUrl: '',
			frameShortCode: '',
			frameCode: '',
			previewUrl: '',

			showedCopyNotification: false,
			showed_tooltip: false,
		};

		this.changeUserName = this.changeUserName.bind(this);
		this.changeAdminEmail = this.changeAdminEmail.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.changePhone = this.changePhone.bind(this);
		this.changeRefCode = this.changeRefCode.bind(this);
		this.clickEditCard = this.clickEditCard.bind(this);
	}

	componentDidMount(){
		this.props.getUserInfo({
			user_id: this.props.auth.user.id,
		});

		this.setState({user_pic: this.props.auth.user.pic});
		this.props.getPlan();

		this.previewCriteria.owner = this.props.auth.user.id;
		this.applyUpdatedCriteria();
	}

	filters2url = () => {
		const filter_keys = Object.keys(community_config.FILTERS4URL);

		let url_result = '';
		let is1st = true;
		for(let key of filter_keys){
			if(this.previewCriteria.filter[key] === undefined)
				continue;

			const key_value = this.previewCriteria.filter[key].split("");
			for(let i = 0; i < key_value.length; i++){
				if(key_value[i] === "1"){
					url_result += (is1st ? "" : "-") + community_config.FILTERS4URL[key][i];
					is1st = false;
				}
			}
		}

		return url_result === '' ? 'undefined' : url_result;
	};

	applyUpdatedCriteria = () => {
		console.log(this.previewCriteria);
		const iframe_param = `${this.state.user_fname}-${this.state.user_lname}-${this.previewCriteria.owner}/undefined/null/${this.previewCriteria.lat}/${this.previewCriteria.lng}/${this.filters2url()}`;

		const preview_url = `${window.location.protocol}//${window.location.host}/search-results-iframe/${iframe_param}`;

		this.setState({
			frameUrl: preview_url,
			frameShortCode: `<iframe src="${preview_url}" style="width: 100%; height: 100%; outline: none; border: none; overflow: hidden;"/>`,
			frameCode: `<iframe src="${preview_url}" style="width: 100%; height: 100%; outline: none; border: none; overflow: hidden;"/>`,
			previewUrl: `/preview-search-results/${iframe_param}`,
		});
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	onChange = e => {
		if(e.target.id === 'user_phone')
			this.setState({is_invalid_phone: false});
		this.setState({[e.target.id]: e.target.value});
	};

	changeUserPic(files){
		const file_size = parseInt(files.size);

		console.log(file_size);

		if(file_size > config.MAX_PIC_SIZE){
			this.setState({showSizeError: true});

			this.tmr = setTimeout(() => {
				this.setState({showSizeError: false});
			}, 3000);
			return;
		}

		this.setState({
			user_pic:
					files.base64.toString()
		});

		const userData = {
			id: this.props.auth.user.id,
			pic: this.state.user_pic,
		};

		this.props.updateUserInfo(userData);
	}

	changeUserName(){
		// if editing, save the username via axios to BE API.
		if(this.state.editingUserName){
			const userData = {
				id: this.props.auth.user.id,
				fname: this.state.user_fname,
				lname: this.state.user_lname,
			};
			this.props.updateUserInfo(userData);
		}
		else{
			this.setState({
				user_fname: this.props.auth.user.fname,
				user_lname: this.props.auth.user.lname,
			});
		}

		// anyway switch display method.
		this.setState({editingUserName: !this.state.editingUserName});
	}

	changeAdminEmail(){
		// if editing, save the username via axios to BE API.
		if(this.state.editingAdminEmail){
			const userData = {
				id: this.props.auth.user.id,
				admin_email: this.state.user_admin_email,
			};
			this.props.updateUserInfo(userData);
		}
		else{
			this.setState({
				user_admin_email: this.props.auth.user.admin_email,
			});
		}

		// anyway switch display method.
		this.setState({editingAdminEmail: !this.state.editingAdminEmail});
	}

	changeEmail(){
		// if editing, save the username via axios to BE API.
		if(this.state.editingEmail){
			const userData = {
				id: this.props.auth.user.id,
				email: this.state.user_email,
				email_verified: false,
			};
			this.props.updateUserInfo(userData);
		}
		else{
			this.setState({
				user_email: this.props.auth.user.email,
			});
		}

		// anyway switch display method.
		this.setState({editingEmail: !this.state.editingEmail});
	}

	changePassword(){
		if(this.state.editingPassword){
			const userData = {
				id: this.props.auth.user.id,
				password: this.state.user_password,
				password2: this.state.user_password2,
			};
			this.props.updateUserInfo(userData);
		}

		// anyway switch display method.
		this.setState({editingPassword: !this.state.editingPassword, user_password: "", user_password2: ""});
	}

	changeRefCode(){
		// if editing, save the referral code via axios to BE database.
		if(this.state.editingRefCode){
			const userData = {
				id: this.props.auth.user.id,
				ref_code: this.state.user_ref_code,
			};
			this.props.updateUserInfo(userData);
		}
		else{
			this.setState({
				user_ref_code: this.props.auth.user.ref_code,
			});
		}

		// anyway switch display method.
		this.setState({editingRefCode: !this.state.editingRefCode});
	}

	changePhone(){
		// if editing, save the referral code via axios to BE database.
		if(this.state.editingPhone){
			if(this.state.is_invalid_phone){
				return;
			}

			const userData = {
				id: this.props.auth.user.id,
				phone: this.state.user_phone,
			};
			this.props.updateUserInfo(userData);
		}
		else{
			this.setState({
				user_phone: this.props.auth.user.phone,
			});
		}

		// anyway switch display method.
		this.setState({editingPhone: !this.state.editingPhone});
	}

	onFocusZipCode = () => {
		// this.setState({showed_tooltip: true});
	};

	onBlurZipCode = () => {
		this.setState({showed_tooltip: false});
	};

	changeZipCode = () => {
		// if editing, save the referral code via axios to BE database.
		if(this.state.editingZipCode){
			const userData = {
				id: this.props.auth.user.id,
				zip_code: this.state.user_zip_code,
				location: this.state.user_location,
			};

			this.props.updateUserInfo(userData);
		}
		else{
			this.setState({
				user_zip_code: this.props.auth.user.zip_code,
			});
		}

		// anyway switch display method.
		this.setState({editingZipCode: !this.state.editingZipCode});
	};

	onChangeAddress = val => {
		this.setState({user_zip_code: val});
	};

	handleSelect = address => {
		const self = this;

		const matches = address.match(/(\d+)/);
		const trimmed_address = address.replace(", USA", "");

		self.setState({my_address: address, user_zip_code: trimmed_address /*matches[0]*/});

		geocodeByAddress(address)
				.then(results => getLatLng(results[0]))
				.then(latLng => {
					self.setState({user_location: {lat: latLng.lat, lng: latLng.lng}});
				})
				.catch(error => console.error('Error', error));
	};

	onBlurPhone = (e) => {
		if(!e.target.validity.valid)
			this.setState({is_invalid_phone: true});
	};

	onVerifyEmail = () => {
		this.props.verifyEmail({
			id: this.props.auth.user.id,
			email: this.props.auth.user.email,
		}, this.props.history);
	};

	async clickEditCard(){
		if(this.state.editing_card){
			const {token} = await this.props.stripe.createToken({name: this.state.name_on_card,});

			/**
			 * register new card.
			 */
			if(token !== undefined){
				this.props.registerCard({
					id: this.props.auth.user.id,
					source: token.id,
					email: this.props.auth.user.email,
					name: this.state.name_on_card,
					description: 'Holder: ' + this.state.name_on_card,
				});
			}
		}
		else{
			const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;
			this.setState({
				name_on_card: customer ? customer.sources.data[0].name : "",
			});
		}

		this.setState({editing_card: !this.state.editing_card});
	}

	cancelEditCard = () => {
		this.setState({editing_card: false});
	};

	copyDynamicUrl = () => {
		if(this.state.showedCopyNotification)
			return;

		const copyText = document.querySelector("#frame-url");
		copyText.select();
		document.execCommand("copy");

		this.setState({
			showedCopyNotification: true
		});

		setTimeout(() => {
			this.setState({
				showedCopyNotification: false
			});
		}, 3000);
	};

	onChangePreviewCategory = e => {
		this.previewCriteria.category = e.target.value;
		this.applyUpdatedCriteria();
	};

	render(){
		const {user} = this.props.auth;

		let next_due_date = "", next_month1 = "", next_month2 = "";
		if(this.props.community.subscription){
			const init_date = new Date(this.props.community.subscription.billing_cycle_anchor * 1000);
			const to_date = new Date();
			next_due_date = init_date;
			let i = 1;
			while(next_due_date.getTime() < to_date.getTime()){
				next_due_date = getNextMonth(init_date, i);
				i++;
			}
			next_month1 = getNextMonth(init_date, i);
			next_month2 = getNextMonth(init_date, i + 1);
		}

		const uc_amount = this.props.community.subscription ?
				showAmount(this.props.community.subscription.plan.amount * this.props.community.my_communities.active.length)
				: (this.props.community.is_sending ?
						<i className="fas fa-spinner fa-spin"/>
						: "");

		const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;

		return (
				<div>
					<div className="w3-modal"
							 style={{display: this.props.is_sending || this.props.community.is_setting_card ? "block" : "none"}}>
						<div className="w3-display-middle w3-text-white w3-jumbo">
							<i className={"fas fa-spinner fa-spin"}/>
						</div>
					</div>
					<main className="account-body"
								style={{filter: this.props.is_sending || this.props.community.is_setting_card ? "blur(4px)" : "none"}}>
						<div className="div-block-213">
							<div id="w-node-5ba554098c6d-44cf2aa3" className="div-block-171">
								<div className="div-block-231">
									<Link to="/dashboard"
												className="button-create w-button">
										<i className="fas fa-th"/><span className="text-span-3">Dashboard</span></Link>
								</div>
							</div>
							<div id="w-node-5ba554098c6a-44cf2aa3" className="div-block-210"><h1 className="heading-40">
								Account Details
							</h1></div>
						</div>
						<div className="div-20bottom">
							<div className="container-inline w3-row">
								<div className="flexdiv-leftright panel underline">
									<h5 className="container-title">Account</h5>
								</div>
								<div className={"sub-container w3-col m12 l6" + (user.email_verified ? " h-right" : " h-right")}>
									<div className={"sub-content account"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">Admin Info</h5>
											<Popup
													trigger={<i style={{cursor: "pointer"}}
																			className={"fas fa-question-circle tooltip-icon"}/>}
													position={"left top"}>
												<div>
													By default, you are the admin for any community that you create and are required to provide at
													least one form of
													communication. If you are not the primary point of contact for the community, you can assign a
													'Community Contact' when
													creating a new community.
												</div>
											</Popup>
										</div>
										<div className="table-row pic" style={{borderBottom: "none"}}>
											<AccountProfileContainer/>
										</div>
										<div className="table-row">
											<h4 className="table-header">Name</h4>
											<h4 className="table-item">
												{this.state.editingUserName ?
														<div className="w3-row">
															<input type="text" className="w3-half"
																		 title="First name" placeholder="First name"
																		 id="user_fname" onChange={this.onChange}
																		 value={this.state.user_fname} autoFocus/>
															<input type="text" className="w3-half"
																		 title="Last name" placeholder="Last name"
																		 id="user_lname" onChange={this.onChange}
																		 value={this.state.user_lname}/>
														</div>
														: user.fname + " " + user.lname
												}
												{this.state.errors.msg_name !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_name}
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeUserName}>
												{this.state.editingUserName ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
										<div className="table-row pic" style={{paddingBottom: "20px"}}>
											<h4 className="table-header">Picture</h4>
											<div className="profpic-div-small" style={{marginLeft: "auto"}}>
												<img src={isEmpty(this.props.auth.user.pic) ?
														"/img/default-user.png"
														: this.props.auth.user.pic}
														 alt="" className="image-4"/>
												<div className={"w3-text-red w3-small"}
														 style={{display: this.state.showSizeError ? "block" : "none"}}>
													Picture file size cannot be larger than 3 MB.
												</div>
											</div>
											<label className={"table-link"} style={{marginTop: "0", lineHeight: "48px"}}>
												<i className={"fas fa-pen"}/>
												<FileBase id="btn-upload" type="file" className="upload-button w-button"
																	multiple={false} onDone={this.changeUserPic.bind(this)}
																	height="38"/>
											</label>
										</div>
										<div className="table-row">
											<h4 className="table-header">Contact Email</h4>
											<h4 className="table-item">
												{this.state.editingAdminEmail ?
														<div className="w3-row">
															<input type="email" className="w3-col"
																		 title="Admin Email" placeholder="Admin Email"
																		 id="user_admin_email" onChange={this.onChange}
																		 value={this.state.user_admin_email} autoFocus/>
														</div>
														: user.admin_email
												}
												{this.state.errors.msg_admin_email !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_admin_email}
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeAdminEmail}>
												{this.state.editingAdminEmail ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">Contact Phone</h4>
											<h4 className="table-item">
												{this.state.editingPhone ?
														<div className="w3-row">
															<input type="tel" className="w3-col"
																		 title="Phone" placeholder="Phone"
																		 pattern={config.US_PHONE_PATTERN}
																		 id="user_phone" onChange={this.onChange}
																		 onBlur={this.onBlurPhone}
																		 value={this.state.user_phone} autoFocus/>
														</div>
														: user.phone
												}
												{this.state.errors.msg_phone !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_phone}
														</div>
														: null}
												{this.state.is_invalid_phone ?
														<div className="error-item">
															Invalid phone number
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changePhone}>
												{this.state.editingPhone ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">City or zip code</h4>
											<h4 className="table-item">
												{this.state.editingZipCode ?
														<div className="w3-row" style={{position: "relative"}}>
															<PlacesAutocomplete
																	value={this.state.user_zip_code}
																	onChange={this.onChangeAddress}
																	onSelect={this.handleSelect}
															>
																{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
																		<>
																			<Tooltip placement={"top"}
																							 overlay={`This coordinate is used as the point of origin for the search results displaying your active communities on your own website. If you or your organization does not have a website, or you have communities located in more than one state - you can leave this field blank.`}
																							 align={{offset: [0, 2],}}
																							 visible={this.state.showed_tooltip}
																			>
																				<input className="w3-col"
																							 title={`Lat: ${this.state.user_location.lat}, Lng: ${this.state.user_location.lng}, ${this.state.my_address}`}
																							 {...getInputProps({
																								 placeholder: "Zip code",
																							 })}
																							 onFocus={this.onFocusZipCode}
																							 onBlur={this.onBlurZipCode}
																							 style={{borderColor: this.props.errors.msg_reg_zip_code ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																							 required="" autoFocus/>
																			</Tooltip>
																			<div className={"search-address-candidates"}
																					 style={{top: "24px", left: "0", textAlign: "left"}}
																			>
																				{loading ?
																						<div
																								className={"w3-container w3-white we-text-grey w3-padding-large"}>...Loading</div> : null}
																				{suggestions.map((suggestion) => {
																					const style = {
																						color: suggestion.active ? "#ffffff" : "#254184",
																						backgroundColor: suggestion.active ? "#41b6e6" : "#e6e6e6",
																						backgroundImage: "url('/img/icon/icon-address-fill.svg')",
																						textAlign: "left",
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
														: user.zip_code
												}
												{this.state.errors.msg_zip_code !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_zip_code}
														</div>
														: null}
												{this.state.is_invalid_zip_code ?
														<div className="error-item">
															Invalid zip code
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeZipCode}>
												{this.state.editingZipCode ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
									</div>
								</div>
								<div className={"sub-container w3-col m12 l6" + (user.email_verified ? " h-right" : " h-right")}>
									<div className={"sub-content account"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">User Info</h5>
											<Popup
													trigger={<i style={{cursor: "pointer"}}
																			className={"fas fa-question-circle tooltip-icon"}/>}
													position={"left top"}>
												<div>
													This information is private and only viewable by you. Use this section to update your login
													credentials at any time.
												</div>
											</Popup>
										</div>
										<div className="table-row">
											<h4 className="table-header">Email</h4>
											<h4 className="table-item" title={
												user.email_verified ? "This email was verified." : ""
											}>
												{this.state.editingEmail ?
														<div className="w3-row">
															<input type="email" className="w3-col"
																		 title="Email" placeholder="Email"
																		 id="user_email" onChange={this.onChange}
																		 value={this.state.user_email} autoFocus/>
														</div>
														: (
																<>
																	{user.email}
																	{user.email_verified ? (
																			<img src={"/img/icon/icon-verified.svg"}
																					 className={"verified-mark"}
																					 alt={"verified mark"}
																					 title={"Verified at: " + new Date(user.email_verified_at).toString()}/>
																	) : (
																			<div className={"email-verify-part"}>
																				<div>
																					Email not verified.
																				</div>
																				{this.props.auth.user.pended_at ? (
																						<div>
																							Email change pending
																							confirmation:<br/>{
																							new Date(this.props.auth.user.pended_at).toLocaleString('en-US')
																						}
																						</div>
																				) : null}
																				<div className={"link"} style={{cursor: "pointer"}}
																						 onClick={this.onVerifyEmail}>
																					{this.props.auth.user.pended_at ? "Res" : "S"}end
																					Confirmation Link
																				</div>
																			</div>
																	)}
																</>
														)
												}
												{this.state.errors.msg_email !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_email}
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeEmail}>
												{this.state.editingEmail ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">Password</h4>
											<h4 className="table-item">
												{this.state.editingPassword ?
														<div className="w3-row">
															<input type="password" className="w3-half"
																		 title="Password" placeholder="Password"
																		 id="user_password" onChange={this.onChange}
																		 value={this.state.user_password} autoFocus/>
															<input type="password" className="w3-half"
																		 title="Confirm" placeholder="Confirm"
																		 id="user_password2" onChange={this.onChange}
																		 value={this.state.user_password2}/>
														</div>
														: "*".repeat(8)
												}
												{this.state.errors.msg_password !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_password}
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changePassword}>
												{this.state.editingPassword ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">
												Referral Code
											</h4>
											<h4 className="table-item">
												{this.state.editingRefCode ?
														<div className="w3-row">
															<input type="text" className="w3-col"
																		 title="Referral code" placeholder="Referral code"
																		 id="user_ref_code" onChange={this.onChange}
																		 value={this.state.user_ref_code} autoFocus/>
														</div>
														: user.ref_code
												}
												{this.state.errors.msg_ref_code !== undefined ?
														<div className="error-item">
															{this.state.errors.msg_ref_code}
														</div>
														: null}
											</h4>
											<Link to="#" className="table-link" onClick={this.changeRefCode}>
												{this.state.editingRefCode ? (
														<i className={"fas fa-save"}/>
												) : (
														<i className={"fas fa-pen"}/>
												)}
											</Link>
										</div>
										<div className="table-row">
											<h4 className="table-header">Registration</h4>
											<h4 className="table-item">
												{
													/**
													 * It displays the registered date in the client's locale format.
													 */
													new Date(user.registered_at).toLocaleDateString('en-US')
												}
											</h4>
										</div>
									</div>
								</div>
							</div>
							{/*
							<div className="container-inline w3-row">
								<div className="flexdiv-leftright panel underline">
									<h5 className="container-title">Developer Console</h5>
								</div>
								<div className={"sub-container w3-col m12 l6 search-preview"}>
									<div className={"sub-content payment"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">
												iFrame Code
											</h5>
											<Popup
													trigger={<i style={{cursor: "pointer"}}
																			className={"fas fa-question-circle tooltip-icon"}/>}
													position={"left center"}>
												<div>
													This is a snapshot displaying: the number of communities currently active out of the
													total number of communities you've paid for this billing cycle; the price you're paying per
													active community; and a preview of your upcoming payments based on your current account
													summary.
												</div>
											</Popup>
										</div>
										<div className="flexdiv-leftright">
											<div style={{
												minHeight: "64px",
												wordBreak: "break-all",
												paddingTop: "16px",
											}}>
												<div style={{float: "left", width: "50%", textAlign: "right"}}>
												</div>
												<div>
													{this.state.frameShortCode}
													<input id={"frame-url"} value={this.state.frameCode} style={{opacity: "0", width: "8px"}}/>
												</div>
											</div>
										</div>
										<div style={{marginTop: "10px"}}>
											<div className={"purple-link"} onClick={this.copyDynamicUrl}>
												Copy Code
											</div>
											<Link to={this.state.previewUrl} className={"purple-link"}>
												Preview
											</Link>
										</div>
										<div className={"copy-notification"}
												 style={{display: this.state.showedCopyNotification ? "block" : "none"}}>
											Code has been copied to the clipboard.
										</div>
									</div>
								</div>
								<div className={"sub-container w3-col m12 l6 search-preview"}>
									<div className={"sub-content payment"}>
										<img src={"/img/iframe-preview.png"} style={{
											width: "100%",
										}} alt={"preview panel"}/>
									</div>
								</div>
							</div>
							*/}
							<div className="container-inline w3-row">
								<div className="flexdiv-leftright panel underline">
									<h5 className="container-title">Billing</h5>
								</div>
								<div className={"sub-container w3-col m12 l6 bottom"}>
									<div className={"sub-content payment"}>
										<div className="flexdiv-leftright underline">
											<h5 className="container-header">Payment Summary</h5>
											<Popup
													trigger={<i style={{cursor: "pointer"}}
																			className={"fas fa-question-circle tooltip-icon"}/>}
													position={"left center"}>
												<div>
													This is a snapshot showing you how many communities you have active out of the total amount
													you've paid for this billing
													cycle; as well as the upcoming payments you can expect based on your current number of active
													communities.
												</div>
											</Popup>
										</div>
										<div className="table-row-2">
											<div className="flexdiv-left">
												<h4 className="table-header">Active Communities</h4>
											</div>
											<h4 className={"table-item right" + (this.props.community.subscription ? "" : " grey")}
													title={"Communities activated / Paid activations"}>
												{formatNumner(this.props.community.my_communities.active.length)}
												&nbsp;/&nbsp;
												{this.props.community.subscription ?
														formatNumner(this.props.community.subscription.quantity + this.props.community.tickets)
														: (this.props.community.is_sending ?
																<i className="fas fa-spinner fa-spin"/>
																: "00")}
											</h4>
										</div>
										<div className="table-row-2 upcoming" style={{borderBottom: "none"}}>
											<h4 className="table-header">
												Upcoming Payments
											</h4>
											<h4 className={"table-item"}>
												<div className={"upcoming-payment-table-row"}>
													<div><b>Date</b></div>
													<div><b>Active</b></div>
													<div><b>Price</b></div>
													<div><b>Total</b></div>
												</div>
												<div className={"upcoming-payment-table-row"}>
													<div>{this.props.community.subscription ? next_due_date.toLocaleDateString('en-US') : "-"}</div>
													<div>{this.props.community.my_communities.active.length}</div>
													<div>{this.props.community.subscription ?
															showAmount(this.props.community.subscription.plan.amount) : "-"}</div>
													<div>{uc_amount}</div>
												</div>
												<div className={"upcoming-payment-table-row"}>
													<div>{this.props.community.subscription ? next_month1.toLocaleDateString('en-US') : "-"}</div>
													<div>{this.props.community.my_communities.active.length}</div>
													<div>{this.props.community.subscription ?
															showAmount(this.props.community.subscription.plan.amount) : "-"}</div>
													<div>{uc_amount}</div>
												</div>
												<div className={"upcoming-payment-table-row"}>
													<div>{this.props.community.subscription ? next_month2.toLocaleDateString('en-US') : "-"}</div>
													<div>{this.props.community.my_communities.active.length}</div>
													<div>{this.props.community.subscription ?
															showAmount(this.props.community.subscription.plan.amount) : "-"}</div>
													<div>{uc_amount}</div>
												</div>
											</h4>
										</div>
									</div>
								</div>
								<div className={"sub-container w3-col m12 l6 bottom"}>
									<div className={"sub-content payment"}>
										<div className="flexdiv-leftright card underline w3-row">
											<h5 className="container-header w3-col s10">Payment Method</h5>
											{this.props.community.subscription ? (
													<>
														{!this.state.editing_card ? (
																<Link to="#" className={"table-link w3-large w3-col s1"}>
																	<i className={"fas fa-times"}
																		 style={{color: "transparent", cursor: "normal"}}/>
																</Link>
														) : null}
														<Link to="#" className={"table-link w3-col s1"}
																	onClick={this.clickEditCard}>
															{this.state.editing_card ? (
																	<i className={"fas fa-save"}/>
															) : (
																	<i className={"fas fa-pen"}/>
															)}
														</Link>
														{this.state.editing_card ? (
																<Link to="#" className={"table-link w3-large w3-col s1"}
																			onClick={this.cancelEditCard}>
																	<i className={"fas fa-times"}/>
																</Link>
														) : null}
													</>
											) : null}
										</div>
										{this.props.community.subscription ? (
												<>
													<div className="form-row">
														<div className={"pay-info-row"}>
															{this.state.editing_card ? (
																	<div className="w3-row">
																		<input type="text" className="w3-col s12"
																					 title="Name on card" placeholder="Name on card"
																					 id="name_on_card" onChange={this.onChange}
																					 value={this.state.name_on_card} autoFocus/>
																	</div>
															) : (
																	<span className={"w3-center grey"}>
														{customer ? customer.sources.data[0].name : "(Card holder name)"}
													</span>
															)}
														</div>
													</div>
													{this.state.editing_card ? (
															<div className="form-row">
																<CardElement className="CardInfoStyle" style={cardStyle}
																						 disabled={!this.state.editing_card}/>
															</div>
													) : (
															<div className="form-row">
																{customer ? (
																		<div className={"card-detail-item w3-row w3-text-grey"}
																				 style={{width: "100%"}}>
																			<div className={"w3-col s1"}>
																				<img alt={"Credit card"}
																						 src={`/img/card/icon-${customer.sources.data[0].brand.toLowerCase()}.svg`}/>
																			</div>
																			<div className={"w3-col s5"} title={"Card number"}>
																				**** **** ****&nbsp;
																				{customer.sources.data[0].last4}
																			</div>
																			<div className={"w3-col s3"} title={"Expiration"}>
																				{customer.sources.data[0].exp_month}/{customer.sources.data[0].exp_year}
																			</div>
																			<div className={"w3-col s1"}
																					 title={customer.sources.data[0].cvc_check}>
																				***
																			</div>
																			<div className={"w3-col s2"}
																					 title={`Zip code: ${customer.sources.data[0].address_zip_check}`}>
																				{customer.sources.data[0].address_zip}
																			</div>
																		</div>
																) : null}
															</div>
													)}
												</>
										) : (
												<div className={"w3-center w3-padding w3-text-grey"}>
													N/A
												</div>
										)}
										<div className="w-form-done">
											<div>Thank you! Your submission has been received!</div>
										</div>
										<div className="w-form-fail">
											<div>Oops! Something went wrong while submitting the form.</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</main>
					<SiteFooter/>
				</div>
		);
	}
}

Account.propTypes = {
	is_sending: PropTypes.bool.isRequired,
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	getPlan: PropTypes.func.isRequired,
	verifyEmail: PropTypes.func.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	updateUserInfo: PropTypes.func.isRequired,
	getMyCommunities: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
	registerCard: PropTypes.func.isRequired,
	setSearchCriteria: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	is_sending: state.auth.is_sending,
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
		mapStateToProps,
		{
			getMyCommunities,
			verifyEmail,
			getUserInfo,
			registerCard,
			updateUserInfo,
			getBillingStatus,
			getPlan,
			setSearchCriteria
		}
)(injectStripe(Account));
