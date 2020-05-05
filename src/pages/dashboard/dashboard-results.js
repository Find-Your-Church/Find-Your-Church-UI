import React, {Component} from "react";
import ReactDOM from 'react-dom';
import '../../css/dashboard.css';
import '../../css/dashboard-iframe.css';
import ProfileContainer from "../../components/profile-container";
import MyCommunities from "../../components/my-communites";
import SiteFooter from "../../components/site-footer";
import StripeSubscription from "../../components/stripe-subscription";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo} from "../../actions/auth-actions";
import {getBillingStatus, clearLastInvoice, showActivateDlg} from "../../actions/community-actions";
import {Elements} from "react-stripe-elements";
import SiteHeader from "../../components/site-header";
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";
import community_config from "../../conf/community-conf";

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

		this.setState({iFrameHeight:  this.refIframe.current.contentWindow.document.body.scrollHeight + 'px'});
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
			frameShortCode: `<iframe src="${preview_url}" style="width: 100%; height: 100vh; outline: none; border: none; overflow: hidden;"></iframe>`,
			frameCode: `<iframe src="${preview_url}" style="width: 100%; height: 100vh; outline: none; border: none; overflow: hidden;"></iframe>`,
			previewUrl: `/preview-search-results/${iframe_param}`,
		});
	};

	showSubDlg(){
		this.props.showActivateDlg();
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
						<main className="admin-body w3-row"
									style={{filter: (this.props.community.activating || this.props.community.deactivating || this.props.community.showing) ? "blur(4px)" : "none"}}>
							<div className={"admin-wrapper"}>
								<div className="div-block-213">
									<div id="w-node-5ba554098c6d-44cf2aa3" className="div-block-171">
										<div className="div-block-231"><Link to="/create-new-community"
																												 className="button-create w-button"><i
												className={"fas fa-users"}> </i><span className="text-span-3">New Community</span></Link>
										</div>
									</div>
									<div id="w-node-5ba554098c6a-44cf2aa3" className="div-block-210"><h1 className="heading-40">
										Dashboard - iFrame
									</h1></div>
									<div id="w-node-5ba554098c5f-44cf2aa3" className="div-block-210">
										<div className="div-block-215">
											<Link to="/dashboard" className="link-6">
												<em className="italic-text-7 gray"><i className="fas fa-th"></i></em>
											</Link></div>
										<div className="div-block-215 underline">
											<Link to="/dashboard-results" className="link-6">
												<em className="italic-text-7 current"><i className="fas fa-map-marked-alt"></i></em>
											</Link></div>
									</div>
								</div>
								<div className="div-block-239">
									<div className="accordionheader-div"><h4 className="accountcontainer-header">
										Display your communities on your website using your custom iFrame code below:&nbsp;</h4>
										<Popup
												trigger={<i style={{cursor: "pointer"}}
																		className={"fas fa-question-circle tooltip-icon"}> </i>}
												position={"left top"}>
											<div>
												If your organization has your own website, you can use the code below to display your communities on any page(s) or
												section(s) of your website. The preview below is what your iframe will look like when dispalyed on your website, and only
												displays the communities currently active on your dashboard. The search, filter, and view technology is fully responsive
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
									<div className="_20top-div" style={{display: this.state.showedCopyNotification ? "inline-block" : "none"}}>
										<h4 id="w-node-2d27cd761068-78e24ec3"
																									className="copied-message">Code has been copied to
										clipboard.</h4></div>
								</div>
								<iframe id="preview-frame" src={this.state.frameUrl} ref={this.refIframe}
												style={{width: "100%", outline: "none", border: "none", overflow: "hidden"}}> </iframe>
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
