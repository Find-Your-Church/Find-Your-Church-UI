import {
	ACTIVATE_COMMUNITY,
	DEACTIVATE_COMMUNITY,
	DELETE_COMMUNITY,
	GET_ERRORS,
	RESET_ERRORS,
	GET_MY_COMMUNITIES,
} from "./action-types";
import axios from "axios";
import app_config from "../conf/config";

/**
 * Send 2nd step info with 1st step info to BE via axios.
 * When succeed, remove 1st step info in global state.
 *
 * @param is_new new or edit?
 * @param owner_email email of user who create new community.
 * @param info_1 base information on 1st form.
 * @param info_2 filters specified on 2nd form.
 * @param history
 * @returns {function(...[*]=)}
 */
export const createCommunityStep = (is_new, owner_email, info_1, info_2, history) => dispatch => {
	const info = {
		is_new: is_new,
		data: {
			owner_email: owner_email,
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
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @param owner_email
 * @param activated
 * @returns {function(...[*]=)}
 */
export const getMyCommunities = (owner_email, activated = true) => dispatch => {
	// get communities list via axios.
	const info = {
		owner_email: owner_email,
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
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @param info
 * @param history
 * @returns {function(...[*]=)}
 */
export const activateCommunity = (info, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/communities/activate", info)
		.then(res => {
			dispatch({
				type: ACTIVATE_COMMUNITY,
				payload: info.community_id,
			});
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

/**
 *
 * @param info
 * @param history
 * @returns {function(...[*]=)}
 */
export const deactivateCommunity = (info, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/communities/deactivate", info)
		.then(res => {
			dispatch({
				type: DEACTIVATE_COMMUNITY,
				payload: info.community_id,
			});
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
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
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};
