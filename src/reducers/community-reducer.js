import {CREATE_COMMUNITY, SET_SEARCH_FILTER} from "../actions/action-types";

const initialState = {
	members: [],
	communities: []
};

export default function(state = initialState, action){
	switch(action.type){
		case CREATE_COMMUNITY:
			return Object.assign({}, state, {
				communities: state.communities.concat(action.payload)
			});
		case SET_SEARCH_FILTER:
			break;
		default:
			return state;
	}
}
