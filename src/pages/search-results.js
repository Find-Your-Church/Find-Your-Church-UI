import React, {Component} from 'react';
import CommunityMap from "../components/community-map";
import ListCommunities from "../components/list-communities";
import '../css/search-results.css';
import SearchBar from "../components/search-bar";
import app_config from "../conf/config";

class SearchResults extends Component{
	render(){
		return (
			<main id="content-body" className="w3-row">
				<div id="search-results-header" className="w3-col s12">
					<SearchBar buttonTitle="Update"/>
				</div>
				<CommunityMap isMarkerShown
							  googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${app_config.GOOGLEMAP_API_KEY}`}
							  loadingElement={<div className="w3-col m12 l6"/>}
							  containerElement={<div className="map-body w3-col m12 l6"/>}
							  mapElement={<div className="map-body"/>}
				/>
				<div className="communities-container cream w3-col m12 l6">
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

export default SearchResults;
