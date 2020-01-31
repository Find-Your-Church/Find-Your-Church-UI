import {
	RESET_PASSWORD,
	SET_CURRENT_USER,
	UPDATE_USER_INFO,
	USER_LOADING,
	SET_SENDING_STATUS,
} from "../actions/action-types";

const isEmpty = require("is-empty");
const initialState = {
	isAuthenticated: false,
	user: {},
	loading: false,
	is_sending: false, // if is requesting the password reset?
};

export default function(state = initialState, action){
	switch(action.type){
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				user: action.payload
			};
		case UPDATE_USER_INFO:
			return {
				...state,
				user: {
					...state.user,
					...action.payload,
				}
			};
		case USER_LOADING:
			return {
				...state,
				loading: true
			};
		case RESET_PASSWORD:
			return {
				...state
			};
		case SET_SENDING_STATUS:
			return {
				...state,
				is_sending: action.payload,
			};
		default:
			return state;
	}
}
