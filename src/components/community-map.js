import React from 'react';

// ref to https://medium.com/kirsten-werner/clickable-markers-in-a-google-maps-react-component-3e9a522e1fff
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"

const CommunityMap = withScriptjs(withGoogleMap((props) =>
	<GoogleMap defaultZoom={12} defaultCenter={{lat: 51.511221, lng: -0.119873}}>
		{props.isMarkerShown && <Marker position={{lat: 51.511221, lng: -0.119873}}/>}
	</GoogleMap>));
export default CommunityMap;
