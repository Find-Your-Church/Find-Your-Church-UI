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
import {ScrollTo} from "react-scroll-to";
import '../css/search-results.css';
import sorters from "../actions/sorters";
import {sorter_closest, sorter_farthest, sorter_name_asc, sorter_name_desc, sorter_newest} from "../utils/sorter-func";

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
		this.props.setSearchFilter({days: checks});
		this.setState({days: checks})
	};
	getTimesInfo = (checks) => {
		this.props.setSearchFilter({times: checks});
		this.setState({times: checks})
	};
	getFrequencyInfo = (checks) => {
		this.props.setSearchFilter({frequency: checks});
		this.setState({frequency: checks})
	};
	getAgesInfo = (checks) => {
		this.props.setSearchFilter({ages: checks});
		this.setState({ages: checks})
	};
	getGenderInfo = (checks) => {
		this.props.setSearchFilter({gender: checks});
		this.setState({gender: checks})
	};
	getParkingInfo = (checks) => {
		this.props.setSearchFilter({parking: checks});
		this.setState({parking: checks})
	};
	getMinistriesInfo = (checks) => {
		this.props.setSearchFilter({ministries: checks});
		this.setState({ministries: checks})
	};
	getOtherServicesInfo = (checks) => {
		this.props.setSearchFilter({other_services: checks});
		this.setState({other_services: checks})
	};
	getAmbianceInfo = (checks) => {
		this.props.setSearchFilter({ambiance: checks});
		this.setState({ambiance: checks})
	};
	getEventTypeInfo = (checks) => {
		this.props.setSearchFilter({event_type: checks});
		this.setState({event_type: checks})
	};
	getSupportTypeInfo = (checks) => {
		this.props.setSearchFilter({support_type: checks});
		this.setState({support_type: checks})
	};

	hoverMarker = (index) => {
		this.props.setPicking(index);
	};

	clickMarker = (index) => {
		console.log(index);
		this.myref[index].current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	clearMarker = (index) => {
		this.props.clearPicking();
	};

	render(){
		// sort this.props.community.search_results
		const results = [...this.props.community.search_results];
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
		}

		const pl = this.props.criteria.radius > 1 ? "s" : "";
		return (
			<main id="content-body" className="w3-row">
				<div id="search-results-header" className="w3-col s12">
					<SearchBar buttonTitle="Update" init={true}/>
					<Link to={"#"} onClick={this.toggleFilter} className={"filter-link"}>
						Show Filters
					</Link>
					<div className={"sort-part w3-right"}>
						<select id={"sorter"} className={"w3-select"} onChange={this.onChange}>
							<option value={sorters.SORT_NEWEST}>Newest</option>
							<option value={sorters.SORT_NAME_ASC}>A - Z</option>
							<option value={sorters.SORT_NAME_DESC}>Z - A</option>
							<option value={sorters.SORT_DIST_ASC}>Closet</option>
							<option value={sorters.SORT_DIST_DESC}>Farthest</option>
						</select>
					</div>
					<label className={"w3-right w3-text-grey w3-margin-top"}>Sort by:&nbsp;</label>
				</div>
				<CommunityMap isMarkerShown criteria={this.props.criteria}
							  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${app_config.GOOGLEMAP_API_KEY}`}
							  loadingElement={<div/>}
							  containerElement={<div className="map-body"/>}
							  mapElement={<div className="map-content"/>}
							  handleScroll={this.clickMarker}
				/>
				<div className={"filter-panel"} style={{display: this.state.showed_filter ? "block" : "none"}}>
					<div className={"filter-div"}>
						<label className={"filter-label w3-large"}>Filters</label>
						<Popup
							trigger={<i style={{cursor: "pointer"}}
										className={"fas fa-question-circle tooltip-icon w3-right"}> </i>}
							position={"left top"}>
							<div>Tell visitors more about your community...</div>
						</Popup>
					</div>
					<SearchFilterCheck filterTitle="Day(s)" filterName="days"
									   send={this.getDaysInfo}
									   value={this.state.days}
									   items={community_config.FILTERS.days}/>
					<SearchFilterCheck filterTitle="Time(s)" filterName="times"
									   send={this.getTimesInfo}
									   value={this.state.times}
									   items={community_config.FILTERS.times}/>
					<SearchFilterRadio filterTitle="Frequency" filterName="frequency"
									   send={this.getFrequencyInfo}
									   value={this.state.frequency}
									   items={community_config.FILTERS.frequency}/>
					<SearchFilterCheck filterTitle="Age(s)" filterName="ages"
									   send={this.getAgesInfo}
									   value={this.state.ages}
									   items={community_config.FILTERS.ages}/>
					<SearchFilterRadio filterTitle="Gender" filterName="gender"
									   send={this.getGenderInfo}
									   value={this.state.gender}
									   items={community_config.FILTERS.gender}/>
					<SearchFilterCheck filterTitle="Parking" filterName="parking"
									   send={this.getParkingInfo}
									   value={this.state.parking}
									   items={community_config.FILTERS.parking}/>
					<SearchFilterCheck filterTitle="Other Ministries"
									   filterName="ministries"
									   send={this.getMinistriesInfo}
									   value={this.state.ministries}
									   items={community_config.FILTERS.ministries}/>
					<SearchFilterCheck filterTitle="Other Services"
									   filterName="other_services"
									   send={this.getOtherServicesInfo}
									   value={this.state.other_services}
									   items={community_config.FILTERS.other_services}/>
					<SearchFilterRadio filterTitle="Ambiance" filterName="ambiance"
									   send={this.getAmbianceInfo}
									   value={this.state.ambiance}
									   items={community_config.FILTERS.ambiance}/>
					<SearchFilterRadio filterTitle="Event Type" filterName="event_type"
									   send={this.getEventTypeInfo}
									   value={this.state.event_type}
									   items={community_config.FILTERS.event_type}/>
					<SearchFilterRadio filterTitle="Support Type"
									   filterName="support_type"
									   send={this.getSupportTypeInfo}
									   value={this.state.support_type}
									   items={community_config.FILTERS.support_type}/>
				</div>
				<div className={"communities-container communities-body communities search-results w3-row"}>
					{results.length > 0 ? (
						<div className="listing-grid dashboard">
							<div className={"search-result-headline"}>
								<div className={"w3-col l10"}>
									<span style={{fontWeight: "bold"}}>
										{this.props.criteria.category}
									</span>
									&nbsp;near&nbsp;
									<span style={{fontWeight: "bold"}}>{this.props.criteria.address}</span>
								</div>
								<div className={"w3-col l2"}>
									Results ({results.length})
								</div>
							</div>
							{results.map((item, index) => {
								this.myref[index] = React.createRef();
								return (
									<div className={"w3-half" + (this.props.community.picking === index ? " selected-thumbnail" : "")} key={"search" + index} ref={this.myref[index]}
										 onMouseEnter={() => this.hoverMarker(index)} onMouseLeave={() => this.clearMarker()}>
										<PublicThumbnail value={item.data}/>
									</div>
								)
							})}
						</div>
					) : (
						<div className={"search-result-headline empty w3-center w3-large"}
							 style={{backgroundImage: "url(/img/icon/icon-warning.svg)"}}
						>
							We couldn't find any {this.props.criteria.category} within {this.props.criteria.radius} mile{pl} of {this.props.criteria.address}.

							Try expanding your search radius or join our mission and create the first one..
						</div>
					)}
				</div>
			</main>
		);
	}
}

SearchResults.propTypes = {
	errors: PropTypes.object.isRequired,
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
