import {CREATE_COMMUNITY_STEP1, GET_ERRORS, GET_MY_COMMUNITIES} from "./action-types";
import axios from "axios";

/**
 * Save 1st step info into global state.
 *
 * @param info community info on 1st form.
 * @param history
 * @returns {function(...[*]=)}
 */
export const createCommunityStep1 = (info, history) => dispatch => {
	dispatch({
		type: CREATE_COMMUNITY_STEP1,
		payload: info,
	});
};

/**
 * Send 2nd step info with 1st step info to BE via axios.
 * When succeed, remove 1st step info in global state.
 *
 * @param owner_email email of user who create new community.
 * @param info_1 base information on 1st form.
 * @param info_2 filters specified on 2nd form.
 * @param history
 * @returns {function(...[*]=)}
 */
export const createCommunityStep2 = (owner_email, info_1, info_2, history) => dispatch => {
	const info = {
		owner_email: owner_email,
		...info_1,
		...info_2,
	};
	axios
		.post("/api/communities/create", info)
		.then(res => history.push("/dashboard/admin"))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};

export const getMyCommunities = (owner_email, activated = true) => dispatch => {
	// get communities list via axios.
	const info = {
		owner_email: owner_email,
		activated: activated,
	};

	axios
		.post("/api/communities/mine", info)
		.then((res) => {
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
