import React, {Component} from 'react';
import CommunityMap from "../components/community-map";
import ListCommunities from "../components/list-communities";
import './css/search-results.css';
import SearchBar from "../components/search-bar";

class SearchResults extends Component{
	render(){
		return (
			<main id="content-body" className="w3-row">
				<div id="search-results-header" className="w3-col s12">
					<SearchBar buttonTitle="Update"/>
				</div>
				<CommunityMap isMarkerShown
							  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAHmAy2d4gujgzmbjA8_fujQq-LwFy1J2c"
							  loadingElement={<div className="w3-col m12 l6"/>}
							  containerElement={<div className="map-body w3-col m12 l6"/>}
							  mapElement={<div className="map-body"/>}
				/>
				<div className="w3-col m12 l6">
					<ListCommunities/>
				</div>
			</main>
		);
	}
}

export default SearchResults;
