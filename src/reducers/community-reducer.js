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
	SET_DIALOG_TITLE,
	SET_STT_SET_CARD,
	CLEAR_LAST_INVOICE,
	SEARCH_CRITERIA,
	COUPON_VERIFIED,
	SET_SEARCH_FILTER,
	SET_SEARCH_RESULTS,
	DEACTIVATING,
	ACTIVATING,
	SHOW_ACT_DLG,
	COUPON_FAILED,
	ACTIVE_STATUS,
	SORT_ORDER,
	SET_PICKING,
	VIEW_COMMUNITY, GET_PLAN, CLEAR_FILTER_MASK, CLEAR_CRITERIA, SEARCHING, SET_BACK_URL
} from "../actions/action-types";
import community_config from "../conf/community-conf";
import sorters from "../actions/sorters";

const initialState = {
	// community
	my_communities: {
		active: [],
		inactive: [],
	},
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
	showing: false,
	activating: false,
	active_status: 0, // 0 - init, 1 - success, 2 - failed
	deactivating: false,
	coupon_verified: false,
	coupon_failed: false,
	plan_price: 0,
	trial_period_days: 0,

	// for search
	criteria: {
		owner: null,
		category: '',
		radius: 5, // 1, 3, and 5 miles -> zoom: 14(1 mile), 12(4 miles), 11(8 miles)
		address: "",
		lat: 44.989999,
		lng: -93.256088,
		filter: {
			days: "0".repeat(community_config.FILTERS.days.length),
			times: "0".repeat(community_config.FILTERS.times.length),
			frequency: "0".repeat(community_config.FILTERS.frequency.length),
			ages: "0".repeat(community_config.FILTERS.ages.length),
			gender: "0".repeat(community_config.FILTERS.gender.length),
			parking: "0".repeat(community_config.FILTERS.parking.length),
			ministries: "0".repeat(community_config.FILTERS.ministries.length),
			other_services: "0".repeat(community_config.FILTERS.other_services.length),
			ambiance: "0".repeat(community_config.FILTERS.ambiance.length),
			event_type: "0".repeat(community_config.FILTERS.event_type.length),
			support_type: "0".repeat(community_config.FILTERS.support_type.length)
		}
	},

	sort_order: sorters.SORT_NEWEST,
	search_results: [],
	counts: {},
	picking: -1, // index of the results
	view_community: null, // community info to be viewed on public view page.
	searching: false,

	back_url: '/search-results', // on the community view page, press back button
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
		case SHOW_ACT_DLG:
			return {
				...state,
				showing: action.payload,
			};
		case ACTIVATING:
			return {
				...state,
				activating: action.payload,
			};
		case ACTIVE_STATUS:
			return {
				...state,
				active_status: action.payload,
			};
		case DEACTIVATING:
			return {
				...state,
				deactivating: action.payload,
			};
		case COUPON_VERIFIED:
			return {
				...state,
				coupon_verified: action.payload, // true or false
			};
		case COUPON_FAILED:
			return {
				...state,
				coupon_failed: action.payload, // true or false
			};
		case GET_PLAN:
			return {
				...state,
				plan_price: action.payload.plan_price,
				trial_period_days: action.payload.trial_period_days,
			};
		case SEARCH_CRITERIA:
			return {
				...state,
				criteria: {
					...state.criteria,
					...action.payload,
				}
			};
		case SET_SEARCH_FILTER:
			return {
				...state,
				criteria: {
					...state.criteria,
					filter: {
						...state.criteria.filter,
						...action.payload,
					}
				}
			};
		case SET_SEARCH_RESULTS:
			console.log(action.payload.counts);
			return {
				...state,
				search_results: action.payload.results,
				counts: action.payload.counts,
			};
		case SORT_ORDER:
			return {
				...state,
				sort_order: action.payload,
			};
		case SET_PICKING:
			return {
				...state,
				picking: action.payload,
			};
		case VIEW_COMMUNITY:
			return {
				...state,
				view_community: action.payload,
			};
		case CLEAR_FILTER_MASK:
			let bits = state.criteria.filter[action.payload.key].split("");
			bits[action.payload.index] = "0";
			const new_filter_value = bits.join("");

			return {
				...state,
				criteria: {
					...state.criteria,
					filter: {
						...state.criteria.filter,
						[action.payload.key]: new_filter_value,
					}
				}
			};
		case CLEAR_CRITERIA:
			return {
				...state,
				criteria: {
					...state.criteria,
					filter: {
						days: "0".repeat(community_config.FILTERS.days.length),
						times: "0".repeat(community_config.FILTERS.times.length),
						frequency: "0".repeat(community_config.FILTERS.frequency.length),
						ages: "0".repeat(community_config.FILTERS.ages.length),
						gender: "0".repeat(community_config.FILTERS.gender.length),
						parking: "0".repeat(community_config.FILTERS.parking.length),
						ministries: "0".repeat(community_config.FILTERS.ministries.length),
						other_services: "0".repeat(community_config.FILTERS.other_services.length),
						ambiance: "0".repeat(community_config.FILTERS.ambiance.length),
						event_type: "0".repeat(community_config.FILTERS.event_type.length),
						support_type: "0".repeat(community_config.FILTERS.support_type.length),
					}
				}
			};
		case SEARCHING:
			return {
				...state,
				searching: action.payload,
			};
		case SET_BACK_URL:
			return {
				...state,
				back_url: action.payload,
			};
		default:
			return state;
	}
}
