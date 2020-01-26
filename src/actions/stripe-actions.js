import axios from "axios";
import app_config from "../conf/config";
import {GET_ERRORS} from "./action-types";

export const createCustomer = (info, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/stripe/createcustomer", info)
		.then(res => {

		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response !== undefined ? err.response.data : {errors: ""}
			})
		);
};
