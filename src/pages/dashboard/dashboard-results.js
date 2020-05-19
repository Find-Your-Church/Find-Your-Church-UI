import React, {Component} from "react";
import '../../css/dashboard.css';
import '../../css/dashboard-results.css';
import '../../css/dashboard-iframe.css';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo, updateUserInfo} from "../../actions/auth-actions";
import {getBillingStatus, clearLastInvoice, showActivateDlg} from "../../actions/community-actions";
import SiteHeader from "../../components/site-header";
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";
import {SketchPicker} from "react-color";
import community_config, {INIT_FILTERS} from "../../conf/community-conf";
import Tooltip from "rmc-tooltip/es";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";

class DashboardResults extends Component{
	constructor(props){
		super(props);

		let {user} = props.auth;

		this.previewCriteria = {
			owner: null,
			category: '',
			radius: 30,
			address: '',
			lat: 44.989999,
			lng: -93.256088,
			filter: {
				...INIT_FILTERS,
			}
		};

		this.refIframe = React.createRef();

		this.state = {
			errors: {},

			user_fname: user.fname,
			user_lname: user.lname,
			user_lat: user.location ? user.location.lat : null,
			user_lng: user.location ? user.location.lng : null,

			frameUrl: '',
			frameShortCode: '',
			frameCode: '',
			previewUrl: '',

			showedCopyNotification: false,

			iFrameHeight: 'calc(100vw * 9 / 16)',

			showed_details: true,

			showed_header_bg_color: false,
			showed_results_bg_color: false,
			showed_buttons_color: false,
			color_header_bg: '#f3f2f5',
			color_results_bg: '#e8e5ea',
			color_buttons: '#2e89fe',

			showed_tooltip: false,
			tooltip_content: community_config.TOOL_TIPS[""],

			iframe_category: 'undefined',
			iframe_radius: user.location && user.location.lat !== null ? 10 : 30,
			zip_code: user.zip_code,
			showed_tooltip_zipcode: false,
		};

		this.showSubDlg = this.showSubDlg.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	componentDidMount(){
		const customer_info = {
			user_id: this.props.auth.user.id,
		};

		this.props.getUserInfo({
			user_id: this.props.auth.user.id,
		});
		this.props.getBillingStatus(customer_info, this.props.history);

		this.previewCriteria.owner = this.props.auth.user.id;
		this.applyUpdatedCriteria();

		if(!this.state.showed_details)
			this.setState({iFrameHeight: this.refIframe.current.contentWindow.document.body.scrollHeight + 'px'});
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(prevState.iframe_category !== this.state.iframe_category ||
			prevState.iframe_radius !== this.state.iframe_radius ||
			prevState.user_lat !== this.state.user_lat ||
			prevState.user_lng !== this.state.user_lng ||
			prevState.color_header_bg !== this.state.color_header_bg ||
			prevState.color_results_bg !== this.state.color_results_bg ||
			prevState.color_buttons !== this.state.color_buttons){
			this.applyUpdatedCriteria();
		}

		if(prevProps.auth.user !== this.props.auth.user){
			let {user} = this.props.auth;
			this.setState({
				user_lat: user.location ? user.location.lat : null,
				user_lng: user.location ? user.location.lng : null,
				iframe_radius: user.location && user.location.lat !== null ? 10 : 30,
				zip_code: user.zip_code,
			});
		}
	}

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
		const lat = this.state.user_lat === null ? this.previewCriteria.lat : this.state.user_lat;
		const lng = this.state.user_lng === null ? this.previewCriteria.lng : this.state.user_lng;
		const category = this.state.iframe_category.replace(/ /g, '-');
		const striped_color_header_bg = this.state.color_header_bg.substring(1);
		const striped_color_results_bg = this.state.color_results_bg.substring(1);
		const striped_color_buttons = this.state.color_buttons.substring(1);
		const iframe_param = `${this.state.user_fname}-${this.state.user_lname}-${this.previewCriteria.owner}/${category}/${this.state.iframe_radius}/${lat}/${lng}/${striped_color_header_bg}-${striped_color_results_bg}-${striped_color_buttons}/${this.filters2url()}`;

		const preview_url = `${window.location.protocol}//${window.location.host}/search-results-iframe/${iframe_param}`;
		const iframe_style = `width: 100%; height: 100vh; outline: none; border: none; overflow: hidden;`;

		this.setState({
			frameUrl: preview_url,
			frameShortCode: `<iframe id="iframe-community" src="${preview_url}" style="${iframe_style}"/>`,
			frameCode: `<iframe id="iframe-community" src="${preview_url}" style="${iframe_style}"/>`,
			previewUrl: `/preview-search-results/${iframe_param}`,
		});
	};

	showSubDlg(){
		this.props.showActivateDlg();
	}

	selectTabDetail = isDetail => {
		this.setState({showed_details: isDetail});
	}

	onChange = e => {
		if(e.target.id === 'iframe_category'){
			this.setState({
				tooltip_content: community_config.TOOL_TIPS[e.target.value],
				showed_tooltip: true,
			});

			setTimeout(() => {
				this.setState({showed_tooltip: true});
			})
		}

		this.setState({[e.target.id]: e.target.value});
		this.applyUpdatedCriteria();
	};

	onBlurCategory = () => {
		this.setState({
			showed_tooltip: false,
		});
	};

	onChangeAddress = val => {
		this.setState({zip_code: val});
	};

	handleSelect = address => {
		const self = this;

		// const matches = address.match(/(\d+)/);
		const trimmed_address = address.replace(", USA", "");

		self.setState({zip_code: trimmed_address /*matches[0]*/});

		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				self.setState({
					user_lat: latLng.lat,
					user_lng: latLng.lng,
					iframe_radius: 10,
				});

				// save zip_code and location to db.
				this.props.updateUserInfo({
					id: this.props.auth.user.id,
					zip_code: trimmed_address,
					location: {
						lat: latLng.lat,
						lng: latLng.lng,
					},
				});
			})
			.catch(error => console.error('Error', error));
	};

	onFocusZipCode = () => {
		// this.setState({showed_tooltip: true});
	};

	onBlurZipCode = () => {
		this.setState({showed_tooltip_zipcode: false});
	};

	render(){
		return (
			<>
				<SiteHeader/>
				<div>
					<main className="admin-body dashboard-results w3-row"
								style={{filter: (this.props.community.activating || this.props.community.deactivating || this.props.community.showing) ? "blur(4px)" : "none"}}>
						<div className={"admin-wrapper"}>
							<div className="div-block-213">
								<div id="w-node-5ba554098c6d-44cf2aa3" className="div-block-171">
									<div className="div-block-231">
										<Link to="/create-new-community"
													className="button-create w-button">
											<i
												className={"fas fa-users"}/>
											<span className="text-span-3">New Community</span>
										</Link>
									</div>
								</div>
								<div id="w-node-5ba554098c6a-44cf2aa3" className="div-block-210">
									<h1 className="heading-40">
										Iframe
									</h1>
								</div>
								<div id="w-node-5ba554098c5f-44cf2aa3" className="div-block-210">
									<div className="div-block-215">
										<Link to="/dashboard" className="link-6">
											<em className="italic-text-7 gray">
												<i className="fas fa-th"/>
											</em>
										</Link>
									</div>
									<div className="div-block-215 underline">
										<Link to="/dashboard-results" className="link-6">
											<em className="italic-text-7 current">
												<i className="fas fa-code"/>
											</em>
										</Link>
									</div>
								</div>
							</div>
							<div className="tabs-menu-6 w-tab-menu" role="tablist">
								<div data-w-tab="Tab 1"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_details ? "w--current" : ""}`}
										 onClick={() => this.selectTabDetail(true)}>
									<div>Details</div>
								</div>
								<div data-w-tab="Tab 2"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_details ? "" : "w--current"}`}
										 onClick={() => this.selectTabDetail(false)}>
									<div>Preview</div>
								</div>
							</div>
							{
								this.state.showed_details ? (
									<div className={"iframe-details w3-animate-opacity"}>
										<div className="accordionheader-div" style={{
											paddingBottom: "20px",
											borderBottom: "1px solid #d3ced7",
											color: "#333",
										}}>
											<h4 className="accountcontainer-header">
												Iframe embed code generator:
											</h4>
											<Popup
												trigger={<i style={{cursor: "pointer"}}
																		className={"fas fa-question-circle tooltip-icon"}/>}
												position={"left top"}>
												<div>
													If your organization has your own website, you can use the code below to display your
													communities on any page(s) or section(s) of your website. The preview below is what your
													iframe will look like when displayed on your website, and only displays the communities
													currently active on your dashboard. The search, filter, and view technology is fully
													responsive and is compatible with any device or browser.
												</div>
											</Popup>
										</div>
										<div className="div-block-239">
											<div className="accordionheader-div">
												<h4 className="accountcontainer-header">
													Customize your iframe search results display
												</h4>
											</div>
											<div className="iframe-container">
												<div className="form-block-6 w-form">
													<form id="email-form" name="email-form" data-name="Email Form">
														<div className="customiframe-grid">
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Default category:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"right top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<Tooltip placement={"top"} overlay={this.state.tooltip_content}
																					 align={{offset: [0, 2],}}
																					 visible={this.state.showed_tooltip}
																	>
																		<select id="iframe_category" className="iframe-dropdown w-select"
																						onChange={this.onChange} onBlur={this.onBlurCategory}
																						value={this.state.iframe_category}
																						style={{backgroundImage: `url("/img/icon-down3-purple.svg")`}}>
																			<option value="undefined">All Communities</option>
																			{
																				community_config.CATEGORIES.map(cat => {
																					return (
																						<option value={cat} key={cat}
																										title={community_config.TOOL_TIPS[cat]}>{cat}</option>
																					);
																				})
																			}
																		</select>
																	</Tooltip>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Default radius:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<select id="iframe_radius" className="iframe-dropdown w-select"
																					onChange={this.onChange}
																					value={this.state.iframe_radius}
																					style={{backgroundImage: `url("/img/icon-down3-purple.svg")`}}>
																		<option value="null">Radius...</option>
																		{
																			community_config.SEARCH_RADIUS.map(r => {
																				const pl = r > 1 ? "s" : "";
																				return (
																					<option value={r} key={"radius-" + r}>within {r} mile{pl} of</option>
																				);
																			})
																		}
																	</select>
																</div>
															</div>
															<div className="forminput-div" style={{position: "relative"}}>
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Address, city or zip code</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<PlacesAutocomplete
																		value={this.state.zip_code === undefined ? "" : this.state.zip_code}
																		onChange={this.onChangeAddress}
																		onSelect={this.handleSelect}
																	>
																		{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
																			<>
																				<Tooltip placement={"top"}
																								 overlay={`This coordinate is used as the point of origin for the search results displaying your active communities on your own website. If you or your organization does not have a website, or you have communities located in more than one state - you can leave this field blank.`}
																								 align={{offset: [0, 2],}}
																								 visible={this.state.showed_tooltip_zipcode}
																				>
																					<input className="iframe-input w-input"
																								 title={`Lat: ${this.state.user_lat}, Lng: ${this.state.user_lng}, ${this.state.zip_code}`}
																								 {...getInputProps({
																									 placeholder: "",
																								 })}
																								 onFocus={this.onFocusZipCode}
																								 onBlur={this.onBlurZipCode}
																								 style={{borderColor: this.props.errors.msg_reg_zip_code ? "#f00" : "rgba(27, 0, 51, 0.15)"}}
																								 required=""/>
																				</Tooltip>
																				<div className={"search-address-candidates"}
																						 style={{right: "0", top: "72px", minWidth: "100%", maxWidth: "100%"}}>
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
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Header background:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"right top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="text" readOnly={true} id={"color_header_bg"}
																				 className="iframe-input w-input"
																				 value={this.state.color_header_bg}/>
																	<div className="color-button w-button" style={{
																		backgroundColor: this.state.color_header_bg
																	}} onClick={() => {
																		this.setState({showed_header_bg_color: !this.state.showed_header_bg_color});
																	}}/>
																	{
																		this.state.showed_header_bg_color ? (
																			<div style={{position: "absolute"}} onMouseLeave={() => {
																				this.setState({showed_header_bg_color: false});
																			}}>
																				<SketchPicker disableAlpha={true} color={this.state.color_header_bg}
																											onChange={(color, e) => {
																												this.setState({color_header_bg: color.hex});
																											}}/>
																			</div>
																		) : null
																	}
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Results
																		background:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="text" readOnly={true} id={"color_results_bg"}
																				 className="iframe-input w-input"
																				 value={this.state.color_results_bg}/>
																	<div className="color-button w-button" style={{
																		backgroundColor: this.state.color_results_bg
																	}} onClick={() => {
																		this.setState({showed_results_bg_color: !this.state.showed_results_bg_color});
																	}}/>
																	{
																		this.state.showed_results_bg_color ? (
																			<div style={{position: "absolute"}} onMouseLeave={() => {
																				this.setState({showed_results_bg_color: false});
																			}}>
																				<SketchPicker disableAlpha={true} color={this.state.color_results_bg}
																											onChange={(color, e) => {
																												this.setState({color_results_bg: color.hex});
																											}}/>
																			</div>
																		) : null
																	}
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Buttons:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}/>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="text" readOnly={true} id={"color_buttons"}
																				 className="iframe-input w-input"
																				 value={this.state.color_buttons}/>
																	<div className="color-button w-button" style={{
																		backgroundColor: this.state.color_buttons
																	}} onClick={() => {
																		this.setState({showed_buttons_color: !this.state.showed_buttons_color});
																	}}/>
																	{
																		this.state.showed_buttons_color ? (
																			<div style={{position: "absolute"}} onMouseLeave={() => {
																				this.setState({showed_buttons_color: false});
																			}}>
																				<SketchPicker disableAlpha={true} color={this.state.color_buttons}
																											onChange={(color, e) => {
																												this.setState({color_buttons: color.hex});
																											}}/>
																			</div>
																		) : null
																	}
																</div>
															</div>
														</div>
													</form>
													<div className="w-form-done">
														<div>Thank you! Your submission has been received!</div>
													</div>
													<div className="w-form-fail">
														<div>Oops! Something went wrong while submitting the form.</div>
													</div>
												</div>
											</div>
											<div className="accordionheader-div">
												<h4 className="accountcontainer-header">
													Copy your iframe code
												</h4>
												<Popup
													trigger={<i style={{cursor: "pointer"}}
																			className={"fas fa-question-circle tooltip-icon"}/>}
													position={"left top"}>
													<div>
														If your organization has your own website, you can use the code below to display your
														communities on any page(s) or section(s) of your website. The preview below is what your
														iframe will look like when displayed on your website, and only displays the communities
														currently active on your dashboard. The search, filter, and view technology is fully
														responsive and is compatible with any device or browser.
													</div>
												</Popup>
											</div>
											<div className="div-block-182">
												<h4 id="w-node-2d27cd76105d-78e24ec3" className="table-header"
														title={"Parameters: /search-results-iframe/owner/category/radius/lat/lng/colors/filter"}>
													<div>{this.state.frameShortCode}</div>
												</h4>
											</div>
											<div className="_20right-div _20top-div">
												<h4 id="w-node-2d27cd761060-78e24ec3" className="heading-27" style={{paddingTop: "20px"}}>
													<div className={"copy-code-link"} onClick={this.copyDynamicUrl}>Copy Code</div>
													<input id={"frame-url"} value={`${this.state.frameCode}`} onChange={() => {}}
																 style={{opacity: "0", width: "8px", height: "8px"}}/>
												</h4>
											</div>
											<div className="_20top-div"
													 style={{display: this.state.showedCopyNotification ? "inline-block" : "none"}}>
												<h4 id="w-node-2d27cd761068-78e24ec3"
														className="copied-message">Code has been copied to clipboard.</h4>
											</div>
										</div>
										<div className="dashboardheader-div" style={{
											padding: "20px 0",
											borderBottom: "1px solid #d3ced7",
											color: "#333",
										}}>
											<h4 className="accountcontainer-header">How to display your communities on your own site:</h4>
										</div>
										<div className="div-block-267">
											<div>
												<div className="div-block-269">
													<h4 className="heading-55">
														Add an HTML iframe element to the
														page and/or section you wish to display your communities.
													</h4>
													<h5 className="heading-60">
														Every website builder such as Wix, SquareSpace, or WordPress will have the ability to embed
														an iframe code anywhere on your site. Contact our <a
														href="mailto:support@findyourchurch.org">support team</a> if you're having trouble!
													</h5>
													<div className="div-block-270 t1"/>
												</div>
											</div>
											<div>
												<div className="div-block-269">
													<h4 className="heading-55">
														Copy / paste the code above into the HTML iframe element you just added and save your site.
													</h4>
													<h5 className="heading-60">
														Your search results should appear on your website after pasting / saving and be fully
														functional. You may need to update or publish your site to refresh and display the iframe.
													</h5>
													<div className="div-block-270 t2"/>
												</div>
											</div>
											<div>
												<div className="div-block-269">
													<h4 className="heading-55">
														That's it! If you need any help please do not hesitate to contact our <a
														href="mailto:support@findyourchurch.org" className="link-10">support team</a>.
													</h4>
													<h5 className="heading-60">
														The iframe is automatically connected to your dashboard so anytime you add, update, or
														remove a community - it will <b>automatically</b> update anywhere you have your search
														results displayed.
													</h5>
													<div className="div-block-270 t3"/>
												</div>
											</div>
										</div>
									</div>
								) : (
									<>
										<div className="div-block-184 w3-animate-opacity">
											<div className="div-block-185"/>
											<h1 className="heading-28">Find a community near you.</h1>
											<p className="paragraph-5">This could be a header on your communities page or a section above the
												iframe that provides definitions of the community categories your ministry supports. The preview
												below is exactly what your search results will look like when displayed on your own web page. If
												you have any questions, please do not hesitate to contact our <a
													href="mailto:support@findyourchurch.org" className="link-10">support team</a>.
											</p></div>
										<iframe id="iframe-community" src={this.state.frameUrl}
														ref={this.refIframe} title={"preview communities"}
														style={{width: "100%", outline: "none", border: "none", overflow: "hidden"}}/>
									</>
								)
							}
						</div>
					</main>
				</div>
			</>
		);
	}
}

DashboardResults.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
	getBillingStatus: PropTypes.func.isRequired,
	clearLastInvoice: PropTypes.func.isRequired,
	showActivateDlg: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{
		getUserInfo,
		updateUserInfo,
		getBillingStatus,
		clearLastInvoice,
		showActivateDlg,
	}
)(DashboardResults);
