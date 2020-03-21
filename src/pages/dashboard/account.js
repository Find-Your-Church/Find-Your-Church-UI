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
import community_config from "../../conf/community-conf";

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
				days: '0000000',
				times: '000',
				frequency: '00000',
				ages: '00000000000',
				gender: '000',
				parking: '00000',
				ministries: '0000000',
				other_services: '000000',
				ambiance: '0000',
				event_type: '00000000',
				support_type: '00000'
			}
		};

		this.state = {
			showSizeError: false,
			editingUserName: false,
			editingAdminEmail: false,
			editingEmail: false,
			editingPassword: false,
			editingPhone: false,
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
			user_ref_code: user.ref_code === undefined ? "" : user.ref_code,

			name_on_card: this.props.auth.user.billing_info ? this.props.auth.user.billing_info.sources.data[0].name : "",

			frameUrl: '',
			frameShortCode: '',
			frameCode: '',
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

	applyUpdatedCriteria = () => {
		const iframe_param = btoa(JSON.stringify(this.previewCriteria));

		const preview_url = `${window.location.protocol}//${window.location.host}/search-results/${iframe_param}`;
		const short_url = preview_url.substr(0, 160);

		this.setState({
			frameUrl: preview_url,
			frameShortCode: `<iframe src="${short_url}..."></iframe>`,
			frameCode: `<iframe src="${preview_url}"></iframe>`,
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
		const copyText = document.querySelector("#frame-url");
		copyText.select();
		document.execCommand("copy");
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
						<i className="fas fa-spinner fa-spin"> </i>
						: "$0.00");

		const customer = this.props.community.customer ? this.props.community.customer : this.props.auth.user.billing_info;

		return (
				<div>
					<div className="w3-modal"
							 style={{display: this.props.is_sending || this.props.community.is_setting_card ? "block" : "none"}}>
						<div className="w3-display-middle w3-text-white w3-jumbo">
							<i className={"fas fa-spinner fa-spin"}> </i>
						</div>
					</div>
					<main className="account-body"
								style={{filter: this.props.is_sending || this.props.community.is_setting_card ? "blur(4px)" : "none"}}>
						<div className="div-20top _1080">
							<div className="div-20bottom">
								<div className="container-inline w3-row">
									<div className="flexdiv-leftright panel underline">
										<h5 className="container-title">Account</h5>
									</div>
									<div className={"sub-container w3-col m12 l6" + (user.email_verified ? " h-left" : " h-right")}>
										<div className={"sub-content account"}>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">Admin Info</h5>
												<Popup
														trigger={<i style={{cursor: "pointer"}}
																				className={"fas fa-question-circle tooltip-icon"}> </i>}
														position={"left top"}>
													<div>This information is displayed on your Admin Profile. Admins must provide at least one
														form of contact and have the ability to add or remove community members.
													</div>
												</Popup>
											</div>
											<div className="table-row pic">
												<h4 className="table-header">Profile Picture</h4>
												<h4 className="table-item">
													<div className="w3-row">
														<img className={"admin-pic"} src={
															isEmpty(user.pic) ?
																	"/img/default-user.png"
																	: user.pic
														} alt={`${user.fname}`}/>
													</div>
													<div className={"w3-text-red w3-small"}
															 style={{display: this.state.showSizeError ? "block" : "none"}}>
														Picture file size cannot be larger than 3 MB.
													</div>
												</h4>
												<label className={"table-link"}>
													<i className={"fas fa-pen"}> </i>
													<FileBase id="btn-upload" type="file" className="upload-button w-button"
																		multiple={false} onDone={this.changeUserPic.bind(this)}
																		height="38"/>
												</label>
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
															<i className={"fas fa-save"}> </i>
													) : (
															<i className={"fas fa-pen"}> </i>
													)}
												</Link>
											</div>
											<div className="table-row">
												<h4 className="table-header">Email</h4>
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
															<i className={"fas fa-save"}> </i>
													) : (
															<i className={"fas fa-pen"}> </i>
													)}
												</Link>
											</div>
											<div className="table-row">
												<h4 className="table-header">Phone</h4>
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
															<i className={"fas fa-save"}> </i>
													) : (
															<i className={"fas fa-pen"}> </i>
													)}
												</Link>
											</div>
										</div>
									</div>
									<div className={"sub-container w3-col m12 l6" + (user.email_verified ? " h-left" : " h-right")}>
										<div className={"sub-content account"}>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">User Info</h5>
												<Popup
														trigger={<i style={{cursor: "pointer"}}
																				className={"fas fa-question-circle tooltip-icon"}> </i>}
														position={"left top"}>
													<div>This information is private and only viewable by you. You can update your login
														credentials and change your referral code at any time.
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
															<i className={"fas fa-save"}> </i>
													) : (
															<i className={"fas fa-pen"}> </i>
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
															<i className={"fas fa-save"}> </i>
													) : (
															<i className={"fas fa-pen"}> </i>
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
															<i className={"fas fa-save"}> </i>
													) : (
															<i className={"fas fa-pen"}> </i>
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
							</div>
							<div className="div-20bottom">
								<div className="container-inline w3-row">
									<div className="flexdiv-leftright panel underline">
										<h5 className="container-title">Billing</h5>
									</div>
									<div className={"sub-container w3-col m12 l6 search-preview"}>
										<div className={"sub-content payment"}>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">
													How to display your communities on your own website
												</h5>
											</div>
											<div>
												Create Copy Publish
											</div>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">
													iFrame Code
												</h5>
												<Popup
														trigger={<i style={{cursor: "pointer"}}
																				className={"fas fa-question-circle tooltip-icon"}> </i>}
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
													paddingRight: "16px"
												}}>
													<select id="preview-category" onChange={this.onChangePreviewCategory}
																	defaultValue={this.props.community.criteria.category}
																	style={{
																		width: "50%",
																		backgroundColor: "#eee",
																		backgroundImage: "url('/img/icon-down3-purple.svg')",
																	}}
																	className="search-form-dropdown w-node-5cf6ee0e50f1-ddb46e0f w-select w3-col s6">
														<option value="">Category...</option>
														{
															community_config.CATEGORIES.map(cat => {
																return (
																		<option value={cat} key={"search-" + cat}>{cat}</option>
																);
															})
														}
													</select>
													<div style={{float: "left", width: "50%", textAlign: "right"}}>
														<div className={"purple-link"} onClick={this.copyDynamicUrl} style={{
															height: "40px",
															lineHeight: "40px",
														}}>
															Copy
														</div>
													</div>
													<div>
														{this.state.frameShortCode}
														<input id={"frame-url"} value={this.state.frameCode} style={{opacity: "0", width: "8px"}}/>
													</div>
												</div>
											</div>
											<div style={{marginTop: "10px"}}>
												<a href={this.state.frameUrl} className={"purple-link"} target={"_new"}>
													Preview
												</a>
											</div>
										</div>
									</div>
									<div className={"sub-container w3-col m12 l6 search-preview"}>
										<iframe width={"100%"} height={"100%"} src={this.state.frameUrl} style={{
											margin: "-480px -960px",
											width: "2400px",
											height: "1200px",
											overflow: "hidden",
											transform: "scale(0.2)",
										}}></iframe>
									</div>
								</div>
							</div>
							<div className="div-20bottom">
								<div className="container-inline w3-row">
									<div className="flexdiv-leftright panel underline">
										<h5 className="container-title">Billing</h5>
									</div>
									<div className={"sub-container w3-col m12 l6 bottom"}>
										<div className={"sub-content payment"}>
											<div className="flexdiv-leftright underline">
												<h5 className="container-header">Account Summary</h5>
												<Popup
														trigger={<i style={{cursor: "pointer"}}
																				className={"fas fa-question-circle tooltip-icon"}> </i>}
														position={"left center"}>
													<div>This is a snapshot displaying: the number of communities currently active out of the
														total number of communities you've paid for this billing cycle; the price you're paying per
														active community; and a preview of your upcoming payments based on your current account
														summary.
													</div>
												</Popup>
											</div>
											<div className="table-row-2">
												<div className="flexdiv-left">
													<h4 className="table-header">Activations</h4>
													<Popup
															trigger={<i style={{cursor: "pointer"}}
																					className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"right center"}>
														<div>The number of communities currently active out of the total number of communities
															you've paid for this billing cycle. You will only be charged for active communities on
															your next and future billing cycles.
														</div>
													</Popup>
												</div>
												<h4 className={"table-item right" + (this.props.community.subscription ? "" : " grey")}
														title={"Communities activated / Paid activations"}>
													{formatNumner(this.props.community.my_communities.active.length)}
													&nbsp;/&nbsp;
													{this.props.community.subscription ?
															formatNumner(this.props.community.subscription.quantity + this.props.community.tickets)
															: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: "00")}
												</h4>
											</div>
											<div className="table-row-2">
												<div className="flexdiv-left">
													<h4 className="table-header">Price</h4>
													<Popup
															trigger={<i style={{cursor: "pointer"}}
																					className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"right center"}>
														<div>The price you are paying per active community, per month. You are not billed for
															inactive communities.
														</div>
													</Popup>
												</div>
												<h4 className={"table-item right" + (this.props.community.subscription ? "" : " grey")}>
													{this.props.community.subscription ?
															showAmount(this.props.community.subscription.plan.amount)
															: (this.props.community.is_sending ?
																	<i className="fas fa-spinner fa-spin"> </i>
																	: showAmount(this.props.community.plan_price))}
												</h4>
											</div>
											<div className="table-row-2">
												<h4 className="table-header">
													Upcoming Payments
													<Popup
															trigger={<i style={{cursor: "pointer"}}
																					className={"fas fa-question-circle tooltip-icon"}> </i>}
															position={"right center"}>
														<div>(Active Communities) x (Price per Communitiy) = Upcoming Payment</div>
													</Popup>
												</h4>
												<h4 className={"table-item right"}>
													<div className={(this.props.community.subscription ? "" : " grey")}>
														{uc_amount}
														&nbsp;on&nbsp;
														{this.props.community.subscription ?
																next_due_date.toLocaleDateString('en-US')
																: (this.props.community.is_sending ?
																		<i className="fas fa-spinner fa-spin"> </i>
																		: "00/00/0000")}
													</div>
													<div className={(this.props.community.subscription ? "" : " grey")}>
														{uc_amount}
														&nbsp;on&nbsp;
														{this.props.community.subscription ?
																next_month1.toLocaleDateString('en-US')
																: (this.props.community.is_sending ?
																		<i className="fas fa-spinner fa-spin"> </i>
																		: "00/00/0000")}
													</div>
													<div className={(this.props.community.subscription ? "" : " grey")}>
														{uc_amount}
														&nbsp;on&nbsp;
														{this.props.community.subscription ?
																next_month2.toLocaleDateString('en-US')
																: (this.props.community.is_sending ?
																		<i className="fas fa-spinner fa-spin"> </i>
																		: "00/00/0000")}
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
																			 style={{color: "transparent", cursor: "normal"}}> </i>
																	</Link>
															) : null}
															<Link to="#" className={"table-link w3-col s1"}
																		onClick={this.clickEditCard}>
																{this.state.editing_card ? (
																		<i className={"fas fa-save"}> </i>
																) : (
																		<i className={"fas fa-pen"}> </i>
																)}
															</Link>
															{this.state.editing_card ? (
																	<Link to="#" className={"table-link w3-large w3-col s1"}
																				onClick={this.cancelEditCard}>
																		<i className={"fas fa-times"}> </i>
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
													<div className={"w3-center"}>
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
