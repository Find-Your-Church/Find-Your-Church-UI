import {CREATE_COMMUNITY} from "../constants/action-types";

const initialState = {
	members: [],
	communities: []
};

function rootReducer(state = initialState, action){
	if(action.type === CREATE_COMMUNITY){
		return Object.assign({}, state, {
			communities: state.communities.concat(action.payload)
		});
	}
	return state;
}

export default rootReducer;
