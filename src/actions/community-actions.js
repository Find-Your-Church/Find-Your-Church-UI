import {CREATE_COMMUNITY, SET_SEARCH_FILTER} from './action-types';

export function createCommunity(payload){
	return {type: CREATE_COMMUNITY, payload};
}

export function setSearchFilter(filter){
	return {
		type: SET_SEARCH_FILTER,
		payload: filter
	};
}
