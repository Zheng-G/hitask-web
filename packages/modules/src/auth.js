/**
 * @module modules/auth
 */
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import qs from 'qs';
import cookieUtil from 'cookie';
import request, { formatHttpError } from '@hitask/utils/http';
import {
	renameObjectKeys,
	formatObjectTypes,
	isExtension /* , isElectron, invertKeysWithProps */,
} from '@hitask/utils/helpers';
import { ResponseStatus } from '@hitask/constants/server';
import {
	SESSION_SHAPE,
	COOKIE_RENAME_MAP,
	SESSION_RENAME_MAP,
	SESSION_KEY,
} from '@hitask/constants/session';
import { GET_LOCAL_SESSION, SET_LOCAL_SESSION, SET_BADGE_COUNT } from '@hitask/constants/ipcEvents';

// ------------------------------------
// Constants
// ------------------------------------
const initialState = {
	session: null,
	loading: false,
	error: null,
};
const ipc = window.ipc;

// ------------------------------------
// Helpers
// ------------------------------------
/**
 * Get session from cookies using Chrome extension cookie API
 * @function
 * @return {Promise} local session object
 */
const getChromeLocalSession = () => {
	return new Promise((resolve, reject) => {
		if (chrome.cookies) {
			chrome.cookies.get({ url: __PLAY_APP_BASE_URL__, name: SESSION_KEY }, cookie => {
				if (!cookie) {
					return reject(new Error('Cookies not found'));
				}
				return resolve(cookie);
			});
		} else {
			reject(new Error('chrome.cookies is undefined'));
		}
	}).then(cookie => {
		const localSession = formatObjectTypes(
			renameObjectKeys(qs.parse(cookie.value), COOKIE_RENAME_MAP),
			SESSION_SHAPE
		);
		return localSession;
	});
};

/**
 * Get session from client local memory synchronously
 * (localStorage, cookies or local electron config file)
 * @function
 * @return {Object|null} session data
 */
export const getLocalSessionSync = () => {
	if (ipc) {
		const session = ipc.sendSync(GET_LOCAL_SESSION);
		if (session) return session;
	}

	if (window.localStorage) {
		const strSession = window.localStorage.getItem(SESSION_KEY);
		if (strSession) {
			return JSON.parse(strSession);
		}
	}

	const localCookies = window.document.cookie;
	if (!localCookies) return null;
	const cookies = cookieUtil.parse(localCookies);
	const sessionSrc = cookies[SESSION_KEY];
	if (!sessionSrc) return null; // Session not found
	const session = formatObjectTypes(
		renameObjectKeys(qs.parse(sessionSrc), COOKIE_RENAME_MAP),
		SESSION_SHAPE
	);
	return session;
};

/**
 * Save session in local cookies using Chrome extension cookie API
 * @function
 * @param {Object} session session data
 * @return {Promise} saved session data
 */
const setChromeLocalSession = session => {
	return new Promise((resolve, reject) => {
		if (chrome.cookies) {
			chrome.cookies.set(
				{
					url: __PLAY_APP_BASE_URL__,
					domain: `.${__PLAY_APP_BASE_URL__.replace(/(^\w+:|^)\/\//, '')}`,
					name: SESSION_KEY,
					value: session,
				},
				() => {
					if (chrome.runtime.lastError) {
						return reject(chrome.runtime.lastError);
					}
					return resolve();
				}
			);
		} else {
			reject(new Error('chrome.cookies is undefined'));
		}
	});
};

// const setCookieLocalSession = (session) => {
// 	const localCookies = window.document.cookie;
// 	if (!localCookies) return;
// 	const sessionRegExp = new RegExp(`${SESSION_KEY}=([^;]*)`, 'gm');

// 	if (!session) {
// 		// Remove session
// 		try {
// 			let newCookies;
// 			const match = localCookies.match(sessionRegExp);
// 			if (match) {
// 				newCookies = localCookies.replace(`${match[0]};`, '');
// 				newCookies = newCookies.replace(match[0], '');
// 				window.document.cookie = newCookies;
// 			}
// 			// console.log(newCookies);
// 		} catch (error) {
// 			console.error(error);
// 		}
// 		return;
// 	}

// 	// Set session
// 	try {
// 		const sessionRenamed = renameObjectKeys(session, invertKeysWithProps(COOKIE_RENAME_MAP));
// 		const sessionStr = Object.keys(sessionRenamed)
// 			.map(key => cookieUtil.serialize(key, sessionRenamed[key]))
// 			.join('&');
// 		const cookieSession = `${SESSION_KEY}=${sessionStr}`;
// 		const localCookiesObj = cookieUtil.parse(localCookies);
// 		let newCookies;
// 		if (!localCookiesObj) {
// 			newCookies = `${cookieSession}`;
// 		} else if (!localCookiesObj[SESSION_KEY]) {
// 			newCookies = `${localCookies};${cookieSession}`;
// 		} else {
// 			const match = localCookies.match(sessionRegExp);
// 			if (match) {
// 				newCookies = localCookies.replace(match[1], sessionStr);
// 			}
// 		}
// 		if (newCookies) {
// 			window.document.cookie = newCookies;
// 		}
// 		// console.log(newCookies);
// 	} catch (error) {
// 		console.error(error);
// 	}
// };

/**
 * Save session in client local memory
 * (localStorage, cookies or local electron config file)
 * @function
 * @param {Object} session session data
 * @return {Promise} saved session
 */
const setLocalSession = session => {
	if (isExtension) {
		return setChromeLocalSession(session);
	}

	if (ipc) {
		ipc.send(SET_LOCAL_SESSION, session);
	}

	return new Promise((resolve, reject) => {
		if (!window.localStorage) {
			reject(
				new Error('LocalStorage API not found in this environment. Session cannot be saved')
			);
		}
		if (!session) {
			window.localStorage.removeItem(SESSION_KEY);
			// if (!isElectron) {
			// 	setCookieLocalSession();
			// }
			return resolve();
		}

		window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		// if (!isElectron) {
		// 	setCookieLocalSession(session); // Set session in cookie to share it with old webapp
		// }
		return resolve(session);
	});
};

/**
 * Remove session from client local memory
 * @function
 * @return {Promise} empty promise
 */
const removeLocalSession = () => setLocalSession(null);

/**
 * Select available display name of user
 * @function
 * @param {Object} user user data
 * @return {String} display user name
 */
const getUserName = ({ firstName, fullname, emailConfirmed, email, login }) => {
	const displayName = fullname || firstName || login || emailConfirmed || email;
	return displayName;
};

/**
 * Select user common data from full object
 * @function
 * @param {Object} user user data
 * @return {Object} profile with selected fields
 */
const getUserProfile = user => ({
	id: user.id,
	name: getUserName(user),
	pictureHash: user.pictureHash,
	email: user.emailConfirmed || user.email,
});

const resetAppCounters = () => {
	if (ipc) {
		ipc.send(SET_BADGE_COUNT, 0);
	}
};

// ------------------------------------
// Selectors
// ------------------------------------
export const sessionSelector = state => state.auth.session;

export const hasSessionSelector = state => !!sessionSelector(state);

export const selfProfileSelector = createSelector(sessionSelector, session => {
	if (!session) return null;
	return getUserProfile(session);
});

export const selfIdSelector = createSelector(selfProfileSelector, profile => {
	if (!profile) return null;
	return profile.id;
});

export const selfNameSelector = createSelector(selfProfileSelector, profile => {
	if (!profile) return null;
	return profile.name;
});

export const selfPictureHashSelector = createSelector(selfProfileSelector, profile => {
	if (!profile) return null;
	return profile.pictureHash;
});

export const selfEmailSelector = createSelector(selfProfileSelector, profile => {
	if (!profile) return null;
	return profile.email;
});

export const accountTypeSelector = state =>
	state.auth.session ? state.auth.session.accountType : null;

export const loadingSelector = state => state.auth.loading;

export const errorSelector = state => state.auth.error;

// ------------------------------------
// Actions
// ------------------------------------
export const loading = createAction('auth/LOADING');

export const login = createAction('auth/LOGIN', credentials => dispatch => {
	dispatch(loading());
	return request({
		url: 'user/authenticate',
		params: {
			login: credentials.login,
			password: credentials.password,
		},
	});
});

export const loginExternal = createAction('auth/LOGIN_EXTERNAL', token => dispatch => {
	dispatch(loading());
	return request({
		url: 'user/authenticateExternal',
		params: {
			accessToken: token.access_token,
			refreshToken: token.refresh_token,
			providerId: 'GOOGLE',
		},
	});
});

// Only for Chrome extension:
export const getLocalWebappSession = createAction(
	'auth/GET_WEBAPP_SESSION',
	() => (dispatch, getState) => {
		if (!isExtension) return Promise.reject(new Error('Method is for chrome extension only'));
		if (!chrome.cookies) return Promise.reject(new Error('chrome.cookies is undefined'));
		const { auth: { session: stateSession } } = getState();
		return getChromeLocalSession().then(localSession => {
			if (!localSession.sessionId) throw new Error('sessionId is absent');
			if (stateSession && localSession.sessionId === stateSession.sessionId)
				throw new Error('Session is the same');
			return localSession;
		});
	}
);

export const resetModule = createAction('auth/RESET_SESSION', action => {
	removeLocalSession();
	resetAppCounters();
	return action;
});

export const logout = createAction('auth/LOGOUT', () => dispatch => {
	dispatch(loading());
	return request({
		url: 'user/logout',
	});
});

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[login]: {
		next: (state, action) => {
			const session = renameObjectKeys(action.payload.data, SESSION_RENAME_MAP);
			if (!isExtension) {
				setLocalSession(session);
			}
			return {
				...state,
				session,
				loading: false,
				error: null,
			};
		},
		throw: (state, action) => ({
			...state,
			error: formatHttpError(action.payload, {
				message: __T('hi.login.error_service'),
				[ResponseStatus.FORBID]: {
					resMessage: __T('hi.login.error_incorrect_login'),
				},
			}),
			session: null,
			loading: false,
		}),
	},

	[loginExternal]: {
		next: (state, action) => {
			const session = renameObjectKeys(action.payload.data, SESSION_RENAME_MAP);
			if (!isExtension) {
				setLocalSession(session);
			}
			return {
				...state,
				session,
				loading: false,
				error: null,
			};
		},
		throw: state => ({
			...state,
			session: null,
			loading: false,
		}),
	},

	[logout]: {
		next: state => {
			if (window.Intercom) window.Intercom('shutdown');
			removeLocalSession();
			resetAppCounters();
			return {
				...state,
				session: null,
				loading: false,
				error: null,
			};
		},
		throw: (state, action) => ({
			...state,
			error: formatHttpError(action.payload),
			session: null,
			loading: false,
		}),
	},

	// Only for Chrome extension:
	[getLocalWebappSession]: {
		next: (state, action) => {
			if (!action.payload) return state;
			return {
				...state,
				session: action.payload,
			};
		},
		throw: state => state,
	},

	[resetModule]: () => {
		if (window.Intercom) window.Intercom('shutdown');
		return initialState;
	},

	[loading]: state => ({
		...state,
		loading: true,
	}),
};

// ------------------------------------
// Reducer
// ------------------------------------

export default handleActions(ACTION_HANDLERS, initialState);
