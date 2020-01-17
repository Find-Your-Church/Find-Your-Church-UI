import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
	GET_ERRORS,
	SET_CURRENT_USER,
	USER_LOADING
} from "./action-types";

/**
 * Register new user.
 *
 * @param userData
 * @param history
 * @returns {function(...[*]=)}
 */
export const registerUser = (userData, history) => dispatch => {
	axios
		.post("/api/users/register", userData)
		.then(res => history.push("/login-popup")) // re-direct to login on successful register
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
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
		.post("/api/users/googleregister", userData)
		.then(res => history.push("/login-popup")) // re-direct to login on successful register
		.catch(err => {
				dispatch({
					type: GET_ERRORS,
					payload: err.response ? err.response.data : {error: "success"}
				})
			}
		);
};

/**
 * send user information (email & password), and get a token
 *
 * @param userData
 * @returns {function(...[*]=)}
 */
export const loginUser = userData => dispatch => {
	axios
		.post("/api/users/login", userData)
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
			dispatch(setCurrentUser(decoded));
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

/**
 * call back-end api for google social login with token
 *
 * @param userData
 * @returns {function(...[*]=)}
 */
export const loginGoogleUser = userData => dispatch => {
	axios
		.post("/api/users/googlelogin", userData)
		.then(res => {
			console.log(res.data);
			// Save to localStorage
			// Set token to localStorage
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
				type: GET_ERRORS,
				payload: err.response.data
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
 * Loading user information
 *
 * @returns {{type: string}}
 */
export const setUserLoading = () => {
	return {
		type: USER_LOADING
	};
};

/**
 * Do logout.
 * @returns {function(...[*]=)}
 */
export const logoutUser = () => dispatch => {
	// Remove token from local storage
	localStorage.removeItem("jwtToken");

	// Remove auth header for future requests
	setAuthToken(false);

	// Set current user to empty object {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));
};

/**
 * Request the server to reset the password.
 * For the response about this request, the server will send an mail with link to confirmation of resetting.
 *
 * @returns {function(...[*]=)}
 */
export const resetPassword = (userData, history) => dispatch => {
	axios
		.post("/api/users/resetpassword", userData)
		.then(res => history.push("/login-popup"))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response ? err.response.data : {error: ""}
			})
		);
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
		.post("/api/users/doresetpassword", userData)
		.then(res => history.push("/reset"))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response ? err.response.data : {error: ""}
			})
		);
};
