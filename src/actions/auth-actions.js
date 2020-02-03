import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
	MESSAGE_FROM_API, RESET_MESSAGES,
	SET_CURRENT_USER, SET_SENDING_STATUS,
	UPDATE_USER_INFO,
} from "./action-types";
import app_config from "../conf/config";

/**
 * Register new user.
 *
 * @param userData
 * @param history
 * @returns {function(...[*]=)}
 */
export const registerUser = (userData, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/register", userData)
		.then(res => history.push("/welcome")) // re-direct to welcome page on successful register
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response ? err.response.data : {error: "error"}
			})
		);
};

/**
 * register with google account
 *
 * @param userData
 * @param history
 * @returns {function(...[*]=)}
 */
export const registerGoogleUser = (userData, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/googleregister", userData)
		.then(res => history.push("/welcome")) // re-direct to welcome page on successful register
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response ? err.response.data : {error: "error"}
			})
		);
};

/**
 * send user information (email & password), and get a token
 *
 * @param userData
 * @param history
 * @returns {function(...[*]=)}
 */
export const loginUser = (userData, history) => dispatch => {
	dispatch({
		type: RESET_MESSAGES,
		payload: null,
	});
	dispatch({
		type: SET_SENDING_STATUS,
		payload: true,
	});
	axios
		.post(app_config.FYC_API_URL + "/api/users/login", userData)
		.then(res => {
			// Save to localStorage
			// Set token to localStorage
			const {token} = res.data;
			localStorage.setItem("jwtToken", token);

			// Set token to Auth header
			setAuthToken(token);

			// Decode token to get user data
			const decoded = jwt_decode(token);

			// Set current user
			dispatch({
				type: SET_CURRENT_USER,
				payload: decoded
			});

			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});

			history.push("/");
		})
		.catch(err => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			return dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response ? err.response.data : {msg: ""},
			});
		});
};

export const getUserInfo = (user_id) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/userinfo", user_id)
		.then(res => {
			return dispatch({
				type: UPDATE_USER_INFO,
				payload: res.data,
			});
		})
		.catch(err => {

		});
};

/**
 * call back-end api for google social login with token
 *
 * @param userData
 * @returns {function(...[*]=)}
 */
export const loginGoogleUser = userData => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/googlelogin", userData)
		.then(res => {
			// Save token to localStorage
			const {token} = res.data;
			localStorage.setItem("jwtToken", token);

			// Set token to Auth header
			setAuthToken(token);

			// Decode token to get user data
			const decoded = jwt_decode(token);

			// Set current user
			dispatch(setCurrentUser(decoded));
		})
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response ? err.response.data : {error: ""}
			})
		);
};

/**
 * Set logged in user.
 *
 * @param decoded
 * @returns {{payload: *, type: string}}
 */
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
};

/**
 * Do logout.
 * @returns {function(...[*]=)}
 */
export const logoutUser = (history) => dispatch => {
	// Remove token from local storage
	localStorage.removeItem("jwtToken");

	// Remove auth header for future requests
	setAuthToken(false);

	// Set current user to empty object {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));

	history.push("/");
};

/**
 * Request the server to reset the password.
 * For the response about this request, the server will send an mail with link to confirmation of resetting.
 *
 * @returns {function(...[*]=)}
 */
export const resetPassword = (userData, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/resetpassword", userData)
		.then(res => history.push("/login-popup"))
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response.data,
			})
		);
};

export const changePassword = (userData) => dispatch => {
	dispatch({
		type: RESET_MESSAGES,
		payload: null,
	});
	dispatch({
		type: SET_SENDING_STATUS,
		payload: true,
	});
	axios
		.post(app_config.FYC_API_URL + "/api/users/changepassword", userData)
		.then(res => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			return dispatch({
				type: MESSAGE_FROM_API,
				payload: res.data,
			});
		})
		.catch(err => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			return dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response.data,
			});
		});
};

export const verifyEmail = (userData) => dispatch => {
	dispatch({
		type: RESET_MESSAGES,
		payload: null,
	});
	dispatch({
		type: SET_SENDING_STATUS,
		payload: true,
	});
	axios
		.post(app_config.FYC_API_URL + "/api/users/verifyemail", userData)
		.then(res => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			dispatch({
				type: MESSAGE_FROM_API,
				payload: res.data,
			});
			getUserInfo(userData.id);
		})
		.catch(err => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			return dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response.data,
			});
		});
};

/**
 * DO reset the password really.
 *
 * @param userData
 * @param history
 * @returns {function(...[*]=)}
 */
export const doResetPassword = (userData, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/doresetpassword", userData)
		.then(res => history.push("/reset"))
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response.data,
			})
		);
};

export const doChangePassword = (userData, history) => dispatch => {
	dispatch({
		type: RESET_MESSAGES,
		payload: null,
	});
	dispatch({
		type: SET_SENDING_STATUS,
		payload: true,
	});
	axios
		.post(app_config.FYC_API_URL + "/api/users/dochangepassword", userData)
		.then(res => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			dispatch({
				type: MESSAGE_FROM_API,
				payload: res.data,
			});
			history.push("/login-popup");
		})
		.catch(err => {
			dispatch({
				type: SET_SENDING_STATUS,
				payload: false,
			});
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response.data,
			})
		});
};

export const doVerifyEmail = (userData, history) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/doverifyemail", userData)
		.then(res => {
			dispatch({
				type: MESSAGE_FROM_API,
				payload: res.data,
			})
		})
		.catch(err => {
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response.data,
			})
		});
};

export const updateUserInfo = (userData) => dispatch => {
	axios
		.post(app_config.FYC_API_URL + "/api/users/update", userData)
		.then(
			/*res => history.push("/dashboard/account")*/
			res => {
				dispatch({
					type: UPDATE_USER_INFO,
					payload: userData
				});
				dispatch({
					type: MESSAGE_FROM_API,
					payload: res.data
				});
			}
		)
		.catch(err =>
			dispatch({
				type: MESSAGE_FROM_API,
				payload: err.response ? err.response.data : {},
			})
		);
};

export const clearErrors = () => dispatch => {
	return dispatch({
		type: RESET_MESSAGES,
		payload: null,
	})
};
