import {
	GET_MY_COMMUNITIES,
	ACTIVATE_COMMUNITY,
	DEACTIVATE_COMMUNITY,
	DELETE_COMMUNITY
} from "../actions/action-types";

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
		case ACTIVATE_COMMUNITY:
			const inactives = state.my_communities.inactive.filter(item => action.payload !== item._id);
			let picked = state.my_communities.inactive.filter(item => action.payload === item._id);
			if(picked.length > 0){
				picked[0].activated = true;
				const actives = [...state.my_communities.active, ...picked];

				return {
					...state,
					my_communities: {
						active: actives,
						inactive: inactives,
					}
				};
			}
			else
				return state;
		case DEACTIVATE_COMMUNITY:
			const actives_1 = state.my_communities.active.filter(item => action.payload !== item._id);
			let picked_1 = state.my_communities.active.filter(item => action.payload === item._id);
			if(picked_1.length > 0){
				picked_1[0].activated = false;
				const inactives_1 = [...state.my_communities.inactive, ...picked_1];

				return {
					...state,
					my_communities: {
						active: actives_1,
						inactive: inactives_1,
					}
				};
			}
			else
				return state;
		case DELETE_COMMUNITY:
			const new_actives = state.my_communities.active.filter(item => action.payload !== item._id);
			const new_inactives = state.my_communities.inactive.filter(item => action.payload !== item._id);

			return {
				...state,
				my_communities: {
					active: new_actives,
					inactive: new_inactives,
				}
			};
		default:
			return state;
	}
}
