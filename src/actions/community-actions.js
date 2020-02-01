import {
	ACTIVATE_COMMUNITY,
	DEACTIVATE_COMMUNITY,
	DELETE_COMMUNITY,
	GET_SRV_MSG,
	RESET_ERRORS,
	GET_MY_COMMUNITIES,
	SET_BILLING_INFO,
	SET_STT_READY,
	SET_STT_HIDE,
	SET_STT_SENDING,
	PICK_COMMUNITY,
	CLEAR_BILLING_INFO, SET_DIALOG_TITLE, SET_STT_SET_CARD, CLEAR_LAST_INVOICE, SET_MY_POSITION, COUPON_VERIFIED,
} from "./action-types";
import axios from "axios";
import app_config from "../conf/config";

/**
 * Send 2nd step info with 1st step info to BE via axios.
 * When succeed, remove 1st step info in global state.
 *
 * @param is_new new or edit?
 * @param owner_id email of user who create new community.
 * @param info_1 base information on 1st form.
 * @param info_2 filters specified on 2nd form.
 * @param history
 * @returns {function(...[*]=)}
 */
export const createCommunityStep = (is_new, owner_id, info_1, info_2, history) => dispatch => {
	const info = {
		is_new: is_new,
		data: {
			owner_id: owner_id,
			...info_1,
			...info_2,
		}
	};

	console.log(info);

	axios
		.post(app_config.FYC_API_URL + "/api/communities/create", info)
		.then(res => {
			//if(is_new)
			dispatch({
				type: RESET_ERRORS,
				payload: null
			});
			return history.push("/dashboard/admin");
		})
		.catch(err =>
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @param owner_id
 * @param activated
 * @returns {function(...[*]=)}
 */
export const getMyCommunities = (owner_id, activated = true) => dispatch => {
	// get communities list via axios.
	const info = {
		owner_id: owner_id,
		activated: activated,
	};

	axios
		.post(app_config.FYC_API_URL + "/api/communities/mine", info)
		.then((res) => {
			dispatch({
				type: RESET_ERRORS,
				payload: null
			});
			return dispatch({
				type: GET_MY_COMMUNITIES,
				payload: res.data,
			})
		})
		.catch(err =>
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {msg_community: "Unknown error"},
			})
		);
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const registerCard = (info) => dispatch => {
	console.log(info);

	dispatch({
		type: SET_STT_SET_CARD,
		payload: true,
	});
	axios
		.post(app_config.FYC_API_URL + "/api/communities/setcard", info)
		.then(res => {
			dispatch({
				type: SET_BILLING_INFO,
				payload: res.data,
			});
			dispatch({
				type: SET_STT_SET_CARD,
				payload: false,
			});
		})
		.catch(err => {
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			});
			dispatch({
				type: SET_STT_SET_CARD,
				payload: false,
			});
		});
};

export const pickCommunity = (info) => dispatch => {
	dispatch({
		type: PICK_COMMUNITY,
		payload: info.community_id,
	});
};

export const clearLastInvoice = () => dispatch => {
	dispatch({
		type: CLEAR_LAST_INVOICE,
		payload: {},
	});
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const activateCommunity = (info) => dispatch => {
	dispatch({
		type: SET_DIALOG_TITLE,
		payload: "Activating...",
	});
	dispatch({
		type: SET_STT_SENDING,
		payload: {},
	});
	dispatch({
		type: CLEAR_BILLING_INFO,
		payload: {},
	});
	dispatch({
		type: CLEAR_LAST_INVOICE,
		payload: {},
	});
	axios
		.post(app_config.FYC_API_URL + "/api/communities/activate", info)
		.then(res => {
			dispatch({
				type: ACTIVATE_COMMUNITY,
				payload: info.community_id,
			});
			dispatch({
				type: SET_BILLING_INFO,
				payload: res.data,
			});
			dispatch({
				type: SET_STT_SENDING,
				payload: {},
			});
			dispatch({
				type: SET_DIALOG_TITLE,
				payload: "Your community was activated.",
			});
		})
		.catch(err => {
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			});
			dispatch({
				type: SET_STT_HIDE,
				payload: {},
			});
		});
};

/**
 *
 * @param info
 * @returns {function(...[*]=)}
 */
export const deactivateCommunity = (info) => dispatch => {
	dispatch({
		type: SET_DIALOG_TITLE,
		payload: "Deactivating...",
	});
	dispatch({
		type: SET_STT_SENDING,
		payload: {},
	});
	dispatch({
		type: CLEAR_BILLING_INFO,
		payload: {},
	});
	axios
		.post(app_config.FYC_API_URL + "/api/communities/deactivate", info)
		.then(res => {
			dispatch({
				type: DEACTIVATE_COMMUNITY,
				payload: info.community_id,
			});
			dispatch({
				type: SET_BILLING_INFO,
				payload: res.data,
			});
			dispatch({
				type: SET_DIALOG_TITLE,
				payload: "Your community was deactivated.",
			});
			dispatch({
				type: SET_STT_HIDE,
				payload: {},
			});
		})
		.catch(err => {
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			});
			dispatch({
				type: SET_STT_HIDE,
				payload: {},
			});
		});
};

/**
 *
 * @param info
 * @param history
 * @returns {function(...[*]=)}
 */
export const deleteCommunity = (info, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/communities/delete", info)
		.then(res => {
			dispatch({
				type: DELETE_COMMUNITY,
				payload: info.community_id,
			});
		})
		.catch(err =>
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

export const getBillingStatus = (info, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/stripe/getstatus", info)
		.then(res => {
			dispatch({
				type: SET_BILLING_INFO,
				payload: res.data,
			});
		})
		.catch(err =>
			dispatch({
				type: GET_SRV_MSG,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @returns {function(...[*]=)}
 */
export const showActivateDlg = () => dispatch => {
	dispatch({
		type: SET_STT_READY,
		payload: {},
	});
};

export const hideActivateDlg = () => dispatch => {
	dispatch({
		type: SET_STT_HIDE,
		payload: {},
	});
	dispatch({
		type: SET_DIALOG_TITLE,
		payload: "Activate Your Community",
	});
};

export const clearCouponVerified = (info) => dispatch => {
	dispatch({
		type: COUPON_VERIFIED,
		payload: false,
	});
};

// info = {code: 'coupon_id'}
export const verifyCoupon = (info) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/stripe/verifycoupon", info)
		.then(res => {
			dispatch({
				type: COUPON_VERIFIED,
				payload: res.data.verified,
			});
		})
		.catch(err =>
			dispatch({
				type: GET_SRV_MSG,
				payload: false,
			})
		);
};

/**
 * set my position for searching the communities
 *
 * @param pos_info object{address: string, lat: number, lng: number}
 * @returns {function(*): *}
 */
export const setMyPosition = (pos_info) => dispatch => {
	return dispatch({
		type: SET_MY_POSITION,
		payload: pos_info,
	});
};
