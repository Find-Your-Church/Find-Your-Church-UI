import React, {Component} from 'react';

// ref to https://medium.com/kirsten-werner/clickable-markers-in-a-google-maps-react-component-3e9a522e1fff
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setPicking} from "../actions/community-actions";

class CommunityMap extends Component{
	radiusToZoom(radius){
		if(radius > 8)
			return Math.round(14 - Math.log(radius) / Math.LN2);

		let zoom;
		switch(radius){
			case 1:
				zoom = 14;
				break;
			case 2:
				zoom = 13;
				break;
			case 3:
				zoom = 12;
				break;
			case 4:
			case 5:
				zoom = 11;
				break;
			default:
				zoom = 10;
		}
		return zoom; //
	}

	onClickMarker = (index) => {
		this.props.setPicking(index);
		this.props.handleScroll(index);
	};

	render(){
		const zoom = this.radiusToZoom(this.props.criteria.radius);

		return (
			<GoogleMap defaultZoom={zoom} zoom={zoom}
					   mapOptions={{mapTypeControl: false}}
					   defaultCenter={{lat: this.props.criteria.lat, lng: this.props.criteria.lng}}
					   center={{lat: this.props.criteria.lat, lng: this.props.criteria.lng}}
			>
				{this.props.community.search_results.map((item, index) => {
					return (
						<Marker key={"marker" + index} onClick={() => this.onClickMarker(index)}
								position={{
									lat: parseFloat(item.data.coordinate.lat),
									lng: parseFloat(item.data.coordinate.lng),
								}}
								icon={{
									url: this.props.community.picking === index ?
										"/img/icon/icon-address-marker-hover.svg"
										: "/img/icon/icon-address-marker.svg"
								}}
						/>
					)
				})}
			</GoogleMap>
		);
	}
}

CommunityMap.propTypes = {
	community: PropTypes.object.isRequired,
	setPicking: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{setPicking}
)(withGoogleMap(CommunityMap));
