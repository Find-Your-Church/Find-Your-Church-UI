import React, {Component} from "react";
import '../../css/dashboard.css';
import '../../css/dashboard-results.css';
import '../../css/dashboard-iframe.css';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo} from "../../actions/auth-actions";
import {getBillingStatus, clearLastInvoice, showActivateDlg} from "../../actions/community-actions";
import SiteHeader from "../../components/site-header";
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";
import community_config, {INIT_FILTERS} from "../../conf/community-conf";

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

			iFrameHeight: 'calc(100vw * 9 / 16',

			showed_details: true,
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

	onChangePreviewCategory = e => {
		this.previewCriteria.category = e.target.value;
		this.applyUpdatedCriteria();
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
		const radius_in_url = this.state.user_lat === null ? "null" : "30";
		console.log(this.previewCriteria);
		const iframe_param = `${this.state.user_fname}-${this.state.user_lname}-${this.previewCriteria.owner}/undefined/${radius_in_url}/${lat}/${lng}/${this.filters2url()}`;

		const preview_url = `${window.location.protocol}//${window.location.host}/search-results-iframe/${iframe_param}`;

		this.setState({
			frameUrl: preview_url,
			frameShortCode: `<iframe src="${preview_url}" style="width: 100%; height: 100vh; outline: none; border: none; overflow: hidden;"/>`,
			frameCode: `<iframe src="${preview_url}" style="width: 100%; height: 100vh; outline: none; border: none; overflow: hidden;"/>`,
			previewUrl: `/preview-search-results/${iframe_param}`,
		});
	};

	showSubDlg(){
		this.props.showActivateDlg();
	}

	selectTabDetail = isDetail => {
		this.setState({showed_details: isDetail});
	}

	render(){
		/**
		 * TODO: replace:
		 * style={{display: this.props.community.is_showing ? "block" : "block"}}
		 * to
		 * style={{display: this.props.community.is_showing ? "block" : "none"}}
		 */
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
										Dashboard - iFrame
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
												<i className="fas fa-map-marked-alt"/>
											</em>
										</Link>
									</div>
								</div>
							</div>
							<div className="tabs-menu-6 w-tab-menu" role="tablist">
								<div data-w-tab="Tab 1"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_details ? "w--current" : ""}`}
										 href="#" onClick={() => this.selectTabDetail(true)}>
									<div>Details</div>
								</div>
								<div data-w-tab="Tab 2"
										 className={`iframe-tab w-inline-block w-tab-link ${this.state.showed_details ? "" : "w--current"}`}
										 href="#" onClick={() => this.selectTabDetail(false)}>
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
																		className={"fas fa-question-circle tooltip-icon"}> </i>}
												position={"left top"}>
												<div>
													If your organization has your own website, you can use the code below to display your
													communities
													on any page(s) or
													section(s) of your website. The preview below is what your iframe will look like when
													dispalyed on
													your website, and only
													displays the communities currently active on your dashboard. The search, filter, and view
													technology is fully responsive
													and is compatible with any device or browser.
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
																								className={"fas fa-question-circle tooltip-icon"}> </i>}
																		position={"right top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<select id="field-4" name="field-4"
																					data-name="Field 4"
																					className="iframe-dropdown w-select">
																		<option value="">All Communities</option>
																		<option value="">Churches</option>
																		<option value="life_groups">Life Groups</option>
																		<option value="Third">Young Adult Groups</option>
																		<option value="Another Choice">Support Groups</option>
																		<option value="Another Choice">Social Groups</option>
																		<option value="Another Choice">Youth Groups</option>
																		<option value="Another Choice">Focus Groups</option>
																	</select>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Default radius:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}> </i>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<select id="field-2" name="field-2"
																					data-name="Field 2"
																					className="iframe-dropdown w-select">
																		<option value="1">within 1 mile of</option>
																		<option value="3">within 3 miles of</option>
																		<option value="5">within 5 miles of</option>
																		<option value="Another Choice">within 10 miles of</option>
																		<option value="Another Choice">within 20 miles of</option>
																		<option value="Another Choice">within 30 miles of</option>
																	</select>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Address, city or zip code</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}> </i>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="email"
																				 className="iframe-input w-input"
																				 maxLength="256" name="email-6"
																				 data-name="Email 6" placeholder=""
																				 id="email-6" required=""/>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Header background:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}> </i>}
																		position={"right top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="email"
																				 className="iframe-input w-input"
																				 maxLength="256" name="email-6"
																				 data-name="Email 6" placeholder="#f3f2f5"
																				 id="email-6" required=""/>
																	<a href="#" className="color-button base w-button">
																	</a>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Results
																		background:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}> </i>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="email"
																				 className="iframe-input w-input"
																				 maxLength="256" name="email-6"
																				 data-name="Email 6" placeholder="#e8e5ea"
																				 id="email-6" required=""/>
																	<a href="#" className="color-button white w-button">
																	</a>
																</div>
															</div>
															<div className="forminput-div">
																<div className="div-block-285">
																	<label htmlFor="email-7" className="field-label">Buttons:</label>
																	<Popup
																		trigger={<i style={{cursor: "pointer"}}
																								className={"fas fa-question-circle tooltip-icon"}> </i>}
																		position={"left top"}>
																		<div>
																			...
																		</div>
																	</Popup>
																</div>
																<div className="iframeinput-container">
																	<input type="email"
																				 className="iframe-input w-input"
																				 maxLength="256" name="email-6"
																				 data-name="Email 6" placeholder="#2e89fe"
																				 id="email-6" required=""/>
																	<a href="#"
																		 className="color-button blue w-button">
																	</a>
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
																			className={"fas fa-question-circle tooltip-icon"}> </i>}
													position={"left top"}>
													<div>
														If your organization has your own website, you can use the code below to display your
														communities
														on any page(s) or
														section(s) of your website. The preview below is what your iframe will look like when
														dispalyed on
														your website, and only
														displays the communities currently active on your dashboard. The search, filter, and view
														technology is fully responsive
														and is compatible with any device or browser.
													</div>
												</Popup>
											</div>
											<div className="div-block-182">
												<h4 id="w-node-2d27cd76105d-78e24ec3"
														className="table-header">
													{this.state.frameShortCode}
													<input id={"frame-url"} value={this.state.frameCode} style={{opacity: "0", width: "8px"}}/>
												</h4>
											</div>
											<div className="_20right-div _20top-div">
												<h4 id="w-node-2d27cd761060-78e24ec3" className="heading-27" style={{paddingTop: "20px"}}>
													<a href="#" className="link-3" style={{
														color: "#8900fe",
														fontWeight: "600",
														textDecoration: "none"
													}} onClick={this.copyDynamicUrl}>Copy Code</a>
												</h4>
											</div>
											<div className="_20top-div"
													 style={{display: this.state.showedCopyNotification ? "inline-block" : "none"}}>
												<h4 id="w-node-2d27cd761068-78e24ec3"
														className="copied-message">Code has been copied to
													clipboard.</h4>
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
												<div className="div-block-269"><h4 className="heading-55">Add an HTML iframe element to the
													page and/or section you wish to display your communities.</h4><h5
													className="heading-60">Every website builder such as Wix, SquareSpace, or WordPress will
													have the ability to embed an iframe code anywhere on your site. Contact our <a
														href="mailto:support@findyourchurch.org">support team</a> if you're having trouble! </h5>
													<div id="w-node-48c15404bdc2-78e24ec3" className="div-block-270"></div>
												</div>
											</div>
											<div id="w-node-f4ddd54c6618-78e24ec3">
												<div className="div-block-269"><h4 className="heading-55">Copy / paste the code above into the
													HTML iframe element you just added and save your site.</h4><h5 className="heading-60">Your
													search results should appear on your website after pasting / saving and be fully functional.
													You may need to update or publish your site to refresh and display the iframe.</h5>
													<div id="w-node-eb84c39ce958-78e24ec3" className="div-block-270-copy"></div>
												</div>
											</div>
											<div>
												<div className="div-block-269"><h4 className="heading-55">That's it! If you need any help
													please do not hesitate to contact our <a href="mailto:support@findyourchurch.org"
																																	 className="link-10">support team</a>. </h4><h5
													className="heading-60">The iframe is automatically connected to your dashboard so anytime
													you add, update, or remove a community - it will <strong>automatically</strong> update
													anywhere you have your search results displayed. </h5>
													<div className="div-block-270-copy-copy"></div>
												</div>
											</div>
										</div>
									</div>
								) : (
									<iframe id="preview-frame" className={"w3-animate-opacity"} src={this.state.frameUrl}
													ref={this.refIframe}
													style={{width: "100%", outline: "none", border: "none", overflow: "hidden"}}/>
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
	{getUserInfo, getBillingStatus, clearLastInvoice, showActivateDlg}
)(DashboardResults);
