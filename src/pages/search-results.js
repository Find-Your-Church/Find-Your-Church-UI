import React, {Component} from 'react';
import CommunityMap from "../components/community-map";
import SearchBar from "../components/search-bar";
import app_config from "../conf/config";
import community_config from "../conf/community-conf";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import SearchFilterCheck from "../components/search-filter-check";
import SearchFilterRadio from "../components/search-filter-radio";
import {Link} from "react-router-dom";
import {
	clearPicking,
	doSearchCommunities,
	setPicking,
	setSearchCriteria,
	setSearchFilter,
	setSortOrder
} from "../actions/community-actions";
import PublicThumbnail from "../components/public-thumbnail";
import Popup from "reactjs-popup";
import '../css/search-results.css';
import sorters from "../actions/sorters";
import {sorter_closest, sorter_farthest, sorter_name_asc, sorter_name_desc, sorter_newest} from "../utils/sorter-func";
import isEmpty from "../utils/isEmpty";
import SelectedFilters from "../components/selected-filters";

class SearchResults extends Component{
	constructor(props){
		super(props);

		this.myref = [];

		this.state = {
			showed_filter: false,

			days: "0".repeat(community_config.FILTERS.days.length),
			times: "0".repeat(community_config.FILTERS.times.length),
			frequency: "0".repeat(community_config.FILTERS.frequency.length),
			ages: "0".repeat(community_config.FILTERS.ages.length),
			gender: "0".repeat(community_config.FILTERS.gender.length),
			parking: "0".repeat(community_config.FILTERS.parking.length),
			ministries: "0".repeat(community_config.FILTERS.ministries.length),
			other_services: "0".repeat(community_config.FILTERS.other_services.length),
			ambiance: "0".repeat(community_config.FILTERS.ambiance.length),
			event_type: "0".repeat(community_config.FILTERS.event_type.length),
			support_type: "0".repeat(community_config.FILTERS.support_type.length)
		};
	}

	static getDerivedStateFromProps(nextProps, prevState){
		let state_obj = {};

		if(nextProps.days){
			state_obj.days = nextProps.days;
		}
		if(nextProps.times){
			state_obj.times = nextProps.times;
		}
		if(nextProps.frequency){
			state_obj.frequency = nextProps.frequency;
		}
		if(nextProps.ages){
			state_obj.ages = nextProps.ages;
		}
		if(nextProps.gender){
			state_obj.gender = nextProps.gender;
		}
		if(nextProps.parking){
			state_obj.parking = nextProps.parking;
		}
		if(nextProps.ministries){
			state_obj.ministries = nextProps.ministries;
		}
		if(nextProps.other_services){
			state_obj.other_services = nextProps.other_services;
		}
		if(nextProps.ambiance){
			state_obj.ambiance = nextProps.ambiance;
		}
		if(nextProps.event_type){
			state_obj.event_type = nextProps.event_type;
		}
		if(nextProps.support_type){
			state_obj.support_type = nextProps.support_type;
		}

		return state_obj;
	}

	componentDidMount(){
		this.props.doSearchCommunities({...this.props.community.criteria});
	}

	onChange = e => {
		this.props.setSortOrder(parseInt(e.target.value));
	};

	toggleFilter = () => {
		this.setState({showed_filter: !this.state.showed_filter});
	};

	getDaysInfo = (checks) => {
		const obj = {days: checks};
		this.doSearchByFilter(obj);
	};
	getTimesInfo = (checks) => {
		const obj = {times: checks};
		this.doSearchByFilter(obj);
	};
	getFrequencyInfo = (checks) => {
		const obj = {frequency: checks};
		this.doSearchByFilter(obj);
	};
	getAgesInfo = (checks) => {
		const obj = {ages: checks};
		this.doSearchByFilter(obj);
	};
	getGenderInfo = (checks) => {
		const obj = {gender: checks};
		this.doSearchByFilter(obj);
	};
	getParkingInfo = (checks) => {
		const obj = {parking: checks};
		this.doSearchByFilter(obj);
	};
	getMinistriesInfo = (checks) => {
		const obj = {ministries: checks};
		this.doSearchByFilter(obj);
	};
	getOtherServicesInfo = (checks) => {
		const obj = {other_services: checks};
		this.doSearchByFilter(obj);
	};
	getAmbianceInfo = (checks) => {
		const obj = {ambiance: checks};
		this.doSearchByFilter(obj);
	};
	getEventTypeInfo = (checks) => {
		const obj = {event_type: checks};
		this.doSearchByFilter(obj);
	};
	getSupportTypeInfo = (checks) => {
		const obj = {support_type: checks};
		this.doSearchByFilter(obj);
	};

	doSearchByFilter = (obj) => {
		this.props.setSearchFilter(obj);
		this.setState(obj);
		this.props.doSearchCommunities({
			...this.props.community.criteria,
			filter: {
				...this.props.community.criteria.filter,
				...obj,
			}
		});
	};

	hoverMarker = (index) => {
		this.props.setPicking(index);
	};

	clickMarker = (index) => {
		this.myref[index].current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	clearMarker = (index) => {
		this.props.clearPicking();
	};

	refreshComponent = (key, i) => {
		this.forceUpdate();
		const vals = this.props.community.criteria.filter[key].split("");
		vals[i] = "0";
		this.doSearchByFilter({[key]: vals.join("")});
	};

	render(){
		// sort this.props.community.search_results
		const results = this.props.community.search_results ? [...this.props.community.search_results] : [];

		let fnSort;
		switch(this.props.community.sort_order){
			case sorters.SORT_NEWEST:
				fnSort = sorter_newest;
				break;
			case sorters.SORT_NAME_ASC:
				fnSort = sorter_name_asc;
				break;
			case sorters.SORT_NAME_DESC:
				fnSort = sorter_name_desc;
				break;
			case sorters.SORT_DIST_ASC:
				fnSort = sorter_closest;
				break;
			case sorters.SORT_DIST_DESC:
				fnSort = sorter_farthest;
				break;
			default:
				fnSort = sorter_newest;
				break;
		}

		results.sort(fnSort);

		const criteria_radius = isEmpty(this.props.criteria.radius) ? this.props.community.criteria.radius : this.props.criteria.radius;

		const pl = criteria_radius > 1 ? "s" : "";

		let selectedChurches = false;
		let selectedEvents = false;
		let selectedSupportGroups = false;
		if(this.props.community.criteria.category === "Churches"){
			selectedChurches = true;
		}
		else if(this.props.community.criteria.category === "Events"){
			selectedEvents = true;
		}
		else if(this.props.community.criteria.category === "Support Groups"){
			selectedSupportGroups = true;
		}

		return (
			<main id="content-body" className="w3-row">
				<div id={"spinning-modal"} className={"w3-modal"}
					 style={{display: this.props.community.searching ? "block" : "none"}}>
					<div className="w3-display-middle w3-text-white w3-jumbo">
						<i className="fas fa-spinner fa-spin"> </i>
					</div>
				</div>
				<div style={{filter: this.props.community.searching ? "blur(4px)" : "none"}}>
					<div id="search-results-header" className="w3-col s12">
						<SearchBar buttonTitle="Update" init={true}/>
						<Link to={"#"} onClick={this.toggleFilter} className={"filter-link"}>
							{this.state.showed_filter ? "Hide Filters" : "Show Filters"}
						</Link>
						<span className={"sort-group"}>
						<label className={"sort-part-label"}>Sort by:&nbsp;</label>
						<select id={"sorter"} className={"sort-part"} onChange={this.onChange}
								style={{
									backgroundImage: "url('/img/icon-down3-purple.svg')",
								}}
						>
							<option value={sorters.SORT_NEWEST}>Newest</option>
							<option value={sorters.SORT_NAME_ASC}>A - Z</option>
							<option value={sorters.SORT_NAME_DESC}>Z - A</option>
							<option value={sorters.SORT_DIST_ASC}>Closet</option>
							<option value={sorters.SORT_DIST_DESC}>Farthest</option>
						</select>
					</span>
					</div>
					<CommunityMap isMarkerShown criteria={this.props.criteria}
								  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${app_config.GOOGLEMAP_API_KEY}`}
								  loadingElement={<div/>}
								  containerElement={<div className="map-body"/>}
								  mapElement={<div className="map-content"/>}
								  handleScroll={this.clickMarker}
					/>
					<div className={"filter-panel"} style={{display: this.state.showed_filter ? "block" : "none"}}>
						<div className={"selected-filters"}>
							<SelectedFilters filter={this.props.community.criteria.filter}
											 handleRefresh={(key, i) => this.refreshComponent(key, i)}/>
						</div>
						<div className={"filter-header-div"}>
							<label className={"filter-label w3-large"}>Filters</label>
							<Popup
								trigger={<i style={{cursor: "pointer"}}
											className={"fas fa-question-circle tooltip-icon w3-right"}> </i>}
								position={"left top"}>
								<div>Tell visitors more about your community...</div>
							</Popup>
						</div>
						<div className={"filter-group-container"}>
							<SearchFilterCheck filterTitle="Day(s)" filterName="days"
											   send={this.getDaysInfo}
											   value={this.props.community.criteria.filter.days}
											   items={community_config.FILTERS.days}/>
							<SearchFilterCheck filterTitle="Time(s)" filterName="times"
											   send={this.getTimesInfo}
											   value={this.props.community.criteria.filter.times}
											   items={community_config.FILTERS.times}/>
							<SearchFilterRadio filterTitle="Frequency" filterName="frequency"
											   send={this.getFrequencyInfo}
											   value={this.props.community.criteria.filter.frequency}
											   items={community_config.FILTERS.frequency}/>
							<SearchFilterCheck filterTitle="Age(s)" filterName="ages"
											   send={this.getAgesInfo}
											   value={this.props.community.criteria.filter.ages}
											   items={community_config.FILTERS.ages}/>
							<SearchFilterRadio filterTitle="Gender" filterName="gender"
											   send={this.getGenderInfo}
											   value={this.props.community.criteria.filter.gender}
											   items={community_config.FILTERS.gender}/>
							<SearchFilterCheck filterTitle="Parking" filterName="parking"
											   send={this.getParkingInfo}
											   value={this.props.community.criteria.filter.parking}
											   items={community_config.FILTERS.parking}/>
							{selectedChurches ?
								<SearchFilterCheck filterTitle="Other Ministries"
												   filterName="ministries"
												   send={this.getMinistriesInfo}
												   value={this.props.community.criteria.filter.ministries}
												   items={community_config.FILTERS.ministries}/>
								: null}
							{selectedChurches ?
								<SearchFilterCheck filterTitle="Other Services"
												   filterName="other_services"
												   send={this.getOtherServicesInfo}
												   value={this.props.community.criteria.filter.other_services}
												   items={community_config.FILTERS.other_services}/>
								: null}
							{selectedChurches ?
								<SearchFilterRadio filterTitle="Ambiance" filterName="ambiance"
												   send={this.getAmbianceInfo}
												   value={this.props.community.criteria.filter.ambiance}
												   items={community_config.FILTERS.ambiance}/>
								: null}
							{selectedEvents ?
								<SearchFilterRadio filterTitle="Event Type" filterName="event_type"
												   send={this.getEventTypeInfo}
												   value={this.props.community.criteria.filter.event_type}
												   items={community_config.FILTERS.event_type}/>
								: null}
							{selectedSupportGroups ?
								<SearchFilterRadio filterTitle="Support Type"
												   filterName="support_type"
												   send={this.getSupportTypeInfo}
												   value={this.props.community.criteria.filter.support_type}
												   items={community_config.FILTERS.support_type}/>
								: null}
						</div>
					</div>
					<div className={"communities-container communities-body communities search-results w3-row"}>
						{results.length > 0 ? (
							<div className="listing-grid dashboard">
								<div className={"w3-row search-result-headline"}>
									<div className={"search-result-container-header w3-col l10"}>
									<span style={{fontWeight: "bold"}}>
										{isEmpty(this.props.criteria.category) ? "community" : this.props.criteria.category}
									</span>
										&nbsp;near&nbsp;
										<span
											style={{fontWeight: "bold"}}>{isEmpty(this.props.criteria.address) ? "any location" : this.props.criteria.address}</span>
									</div>
									<div className={"search-result-container-header-right w3-col l2"}>
										Results ({results.length})
									</div>
								</div>
								{results.map((item, index) => {
									this.myref[index] = React.createRef();
									return (
										<div
											className={"w3-half" + (this.props.community.picking === index ? " selected-thumbnail" : "")}
											key={"search" + index} ref={this.myref[index]}
											onMouseEnter={() => this.hoverMarker(index)}
											onMouseLeave={() => this.clearMarker()}>
											<PublicThumbnail value={item.data}/>
										</div>
									)
								})}
							</div>
						) : (
							<>
								<div className={"search-result-headline empty"}
									 style={{backgroundImage: "url(/img/icon/icon-warning.svg)"}}>
									<div>
										We couldn't find
										any {isEmpty(this.props.criteria.category) ? "community" : this.props.criteria.category} within {criteria_radius} mile{pl} of {isEmpty(this.props.criteria.address) ? "any location" : this.props.criteria.address}.
									</div>
									<div>
										Try expanding your search radius.
									</div>
									{this.props.auth.isAuthenticated ? null : (
										<>
											<div>
												Or join our mission and create the first one!
											</div>
											<div className="div-block-158">
												<div className="div-navlink noresults">
													<Link to={"/register-popup"}
														  className="link-headernav button-gradient w-button">
														Create an Account
													</Link>
												</div>
											</div>
										</>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</main>
		);
	}
}

SearchResults.propTypes = {
	errors: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	criteria: PropTypes.object.isRequired,
	setSearchCriteria: PropTypes.func.isRequired,
	setSearchFilter: PropTypes.func.isRequired,
	setSortOrder: PropTypes.func.isRequired,
	doSearchCommunities: PropTypes.func.isRequired,
	setPicking: PropTypes.func.isRequired,
	clearPicking: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
	auth: state.auth,
	community: state.communities,
	criteria: state.communities.criteria,

	days: state.communities.criteria.filter.days,
	times: state.communities.criteria.filter.times,
	frequency: state.communities.criteria.filter.frequency,
	ages: state.communities.criteria.filter.ages,
	gender: state.communities.criteria.filter.gender,
	parking: state.communities.criteria.filter.parking,
	ministries: state.communities.criteria.filter.ministries,
	other_services: state.communities.criteria.filter.other_services,
	ambiance: state.communities.criteria.filter.ambiance,
	event_type: state.communities.criteria.filter.event_type,
	support_type: state.communities.criteria.filter.support_type,
});

export default connect(
	mapStateToProps,
	{setSearchCriteria, setSearchFilter, setSortOrder, doSearchCommunities, setPicking, clearPicking}
)(SearchResults);
