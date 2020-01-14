import React from 'react';

// ref to https://medium.com/kirsten-werner/clickable-markers-in-a-google-maps-react-component-3e9a522e1fff
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"

const CommunityMap = withScriptjs(withGoogleMap((props) =>
	<GoogleMap defaultZoom={8} defaultCenter={{lat: -34.397, lng: 150.644}}>
		{props.isMarkerShown && <Marker position={{lat: -34.397, lng: 150.644}}/>}
	</GoogleMap>));

export default CommunityMap;
