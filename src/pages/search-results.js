import React, {Component} from 'react';
import CommunityMap from "../components/community-map";
import ListCommunities from "../components/list-communities";
import '../css/search-results.css';
import SearchBar from "../components/search-bar";
import app_config from "../conf/config";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class SearchResults extends Component{
	render(){
		return (
			<main id="content-body" className="w3-row">
				<div id="search-results-header" className="w3-col s12">
					<SearchBar buttonTitle="Update"/>
				</div>
				<CommunityMap isMarkerShown pos={this.props.my_pos}
							  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${app_config.GOOGLEMAP_API_KEY}`}
							  loadingElement={<div/>}
							  containerElement={<div className="map-body"/>}
							  mapElement={<div className="map-body"/>}
				/>
				<div className="communities-container cream">
					<div className="resultssort-div">
						<h3 className="listings-header">
							Youth Group's near 315 1st Ave. NE Minneapolis, MN 55413</h3>
						<h4 className="results-text">
							Results (16)
						</h4>
					</div>
					<ListCommunities/>
				</div>
			</main>
		);
	}
}

SearchResults.propTypes = {
	errors: PropTypes.object.isRequired,
	my_pos: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
	my_pos: state.communities.my_position,
});

export default connect(
	mapStateToProps,
	{}
)(SearchResults);
