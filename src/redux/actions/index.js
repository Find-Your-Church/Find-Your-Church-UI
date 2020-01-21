import {CREATE_COMMUNITY} from '../constants/action-types';

export function createCommunity(payload){
	return {type: CREATE_COMMUNITY, payload};
}
