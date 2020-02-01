import React, {Component} from 'react';

// ref to https://medium.com/kirsten-werner/clickable-markers-in-a-google-maps-react-component-3e9a522e1fff
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"

/*
const CommunityMap = withScriptjs(
	withGoogleMap(
		(props) =>
			<GoogleMap defaultZoom={12} defaultCenter={{lat: props.pos.lat, lng: props.pos.lng}}>
				{props.isMarkerShown && <Marker position={{lat: props.pos.lat, lng: props.pos.lng}}/>}
			</GoogleMap>
	));
*/

class CommunityMap extends Component{
	constructor(props){
		super(props);

		this.state = {
			lat: this.props.pos.lat,
		};

		this.moveUp = this.moveUp.bind(this);
	}

	moveUp(){
		this.setState({lat: this.state.lat + 1});
	}

	render(){
		return (
			<GoogleMap defaultZoom={12}
					   enter={{lat: this.state.lat, lng: this.props.pos.lng}}
					   defaultCenter={{lat: this.state.lat, lng: this.props.pos.lng}}>
				{this.props.isMarkerShown &&
				<Marker position={{lat: this.props.pos.lat, lng: this.props.pos.lng}}/>}
			</GoogleMap>
		);
	}
}

export default withGoogleMap(CommunityMap);
