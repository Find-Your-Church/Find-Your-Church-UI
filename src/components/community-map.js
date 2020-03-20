import React, {Component} from 'react';

// ref to https://medium.com/kirsten-werner/clickable-markers-in-a-google-maps-react-component-3e9a522e1fff
import {withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {setPicking} from "../actions/community-actions";

class CommunityMap extends Component{
	constructor(props){
		super(props);


		this.state = {
			lat: 0,
			lng: 0,
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(this.props.criteria.lat !== prevProps.criteria.lat){
			this.setState({lat: this.props.criteria.lat});
		}
		if(this.props.criteria.lng !== prevProps.criteria.lng){
			this.setState({lng: this.props.criteria.lng});
		}

		if(this.props.community.picking !== -1 && this.props.community.picking !== prevProps.community.picking){
			this.setState({
				lat: parseFloat(this.props.results[this.props.community.picking].data.coordinate.lat),
				lng: parseFloat(this.props.results[this.props.community.picking].data.coordinate.lng),
			});
		}
	}

	radiusToZoom(radius){
		if(radius === null || radius === undefined || isNaN(radius))
			return 2;

		if(radius > 8)
			return Math.round(14 - Math.log(radius) / Math.LN2);

		let zoom;
		switch(radius){
			case 1:
				zoom = 14;
				break;
			case 2:
			case 3:
				zoom = 13;
				break;
			case 4:
			case 5:
				zoom = 12;
				break;
			default:
				zoom = 14;
		}
		return zoom; //
	}

	/**
	 *
	 * @param index
	 */
	onClickMarker = (index) => {
		this.props.setPicking(index);
		this.props.handleScroll(index);
	};

	render(){
		const zoom = this.radiusToZoom(this.props.criteria.radius);

		return (
				<GoogleMap defaultZoom={zoom} zoom={zoom}
									 mapOptions={{mapTypeControl: false}}
									 center={this.state.lat === 0 ?
											 {lat: this.props.community.criteria.lat, lng: this.props.community.criteria.lng}
											 : {lat: this.state.lat, lng: this.state.lng}}
									 defaultCenter={this.props.results.length === 0 ?
											 {lat: this.props.community.criteria.lat, lng: this.props.community.criteria.lng}
											 : {
												 lat: parseFloat(this.props.results[0].data.coordinate.lat),
												 lng: parseFloat(this.props.results[0].data.coordinate.lng),
											 }}
				>
					{this.props.results.map((item, index) => {
						const lat = parseFloat(item.data.coordinate.lat);
						const lng = parseFloat(item.data.coordinate.lng);
						return (
								<Marker key={"marker" + index} onClick={() => this.onClickMarker(index)}
												position={{lat: lat, lng: lng}}
												icon={{
													url: this.props.community.picking === index ?
															"/img/icon/icon-address-marker-hover.svg"
															: "/img/icon/icon-address-marker.svg"
												}}
												zIndex={this.props.community.picking === index ? 1000 : 900}
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
