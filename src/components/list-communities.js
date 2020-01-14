import React from 'react';
import {connect} from "react-redux";

const mapStateToProps = state => {
	return {communities: state.communities};
};

const ConnectedList = ({communities}) => (
	<ul>
		{communities.map(el => (
			<li key={el.id}>{el.title}</li>
		))}
	</ul>
);

const ListCommunities = connect(mapStateToProps)(ConnectedList);

export default ListCommunities;
