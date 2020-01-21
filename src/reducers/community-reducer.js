import {CREATE_COMMUNITY_STEP1, GET_MY_COMMUNITIES} from "../actions/action-types";

const initialState = {
	info_1: {}, // used for temporary.
	my_communities: {
		active: [],
		inactive: [],
	},
	search_results: [],
	members: [],
};

export default function(state = initialState, action){
	switch(action.type){
		case CREATE_COMMUNITY_STEP1:
			return {
				...state,
				info_1: action.payload,
			};
		case GET_MY_COMMUNITIES:
			if(action.payload.activated){
				return {
					...state,
					my_communities: {
						...state.my_communities,
						active: [
							...action.payload.results,
						]
					}
				};
			}
			else{
				return {
					...state,
					my_communities: {
						...state.my_communities,
						inactive: [
							...action.payload.results,
						]
					}
				};
			}
		default:
			return state;
	}
}
