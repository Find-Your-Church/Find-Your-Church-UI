import {
	GET_MY_COMMUNITIES,
	ACTIVATE_COMMUNITY,
	DEACTIVATE_COMMUNITY,
	DELETE_COMMUNITY,
	SET_BILLING_INFO,
	SET_STT_SENDING,
	SET_STT_READY,
	SET_STT_HIDE,
	PICK_COMMUNITY,
	CLEAR_BILLING_INFO,
	SET_DIALOG_TITLE, SET_STT_SET_CARD, CLEAR_LAST_INVOICE, SET_MY_POSITION, COUPON_VERIFIED
} from "../actions/action-types";

const initialState = {
	// community
	my_communities: {
		active: [],
		inactive: [],
	},
	search_results: [],
	members: [],

	// for stripe
	community_activated: null,
	is_setting_card: false,
	is_showing: false,
	is_sending: false,
	is_activate: true, // false means deactivate
	success: false,
	tickets: 0,
	customer: null,
	subscription: null,
	last_invoice: null,
	upcoming_invoice: null,
	trialing: false,
	msg: {},
	dlg_title: "Activate Your Community",
	coupon_verified: false,

	// for search
	my_position: {
		address: "",
		lat: 44.9899597,
		lng: -93.25608609999999,
	},
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
		case PICK_COMMUNITY:
			return {
				...state,
				community_activated: action.payload,
			};
		case SET_BILLING_INFO:
			return {
				...state,
				...action.payload,
			};
		case CLEAR_BILLING_INFO:
			return {
				...state,
				success: false,
				subscription: null,
				upcoming_invoice: null,
				msg: {},
			};
		case SET_STT_SET_CARD:
			return {
				...state,
				is_setting_card: action.payload,
			};
		case CLEAR_LAST_INVOICE:
			return {
				...state,
				last_invoice: null,
			};
		case SET_STT_SENDING:
			return {
				...state,
				is_showing: true,
				is_sending: true,
			};
		case SET_STT_READY:
			return {
				...state,
				is_showing: true,
				is_sending: false,
			};
		case SET_STT_HIDE:
			return {
				...state,
				is_showing: false,
				is_sending: false,
			};
		case SET_DIALOG_TITLE:
			return {
				...state,
				dlg_title: action.payload,
			};
		case COUPON_VERIFIED:
			return {
				...state,
				coupon_verified: action.payload, // true or false
			};
		case SET_MY_POSITION:
			return {
				...state,
				my_position: {
					...state.my_position,
					...action.payload,
				}
			};
		default:
			return state;
	}
}
