// import React from 'react';
// import ReactDOM from 'react-dom';
import { REQUIRED_SESSION_SHAPE } from '@hitask/constants/session';
import { uncheckLoading, isExtension, checkObjectPropsExist } from './helpers';
// import { notifyBugsnagException } from './debug';

export const getLocalState = () =>
	new Promise(resolve => {
		if (isExtension) {
			chrome.storage.local.get('state', state => {
				resolve(state);
			});
		} else {
			resolve({});
		}
	});

export const getInitialState = obj => {
	const localState = JSON.parse(obj.state || '{}');
	const appNotChanged =
		localState.app &&
		localState.app.version === __APP_VERSION__ &&
		localState.app.env === __ENV__;
	const localStateHasValidSession =
		localState.auth &&
		checkObjectPropsExist(localState.auth.session, Object.keys(REQUIRED_SESSION_SHAPE));
	const initialState = appNotChanged
		? localState
		: Object.keys(localState).reduce((acc, key) => {
				if (key === 'auth' && localStateHasValidSession) {
					acc[key] = localState[key];
				}
				return acc;
		  }, {});

	return uncheckLoading(initialState, ['auth', 'items', 'user']);
};

export const getMount = () => document.querySelector('#reactRoot');

// export const handleError = (error) => {
// 	if (__DEV__) {
// 		const mount = getMount();
// 		const RedBox = require('redbox-react').default; // eslint-disable-line global-require
// 		ReactDOM.render(<RedBox error={error} />, mount);
// 		console.error(error);
// 	} else {
// 		throw error;
// 	}
// };

// export const handleUnhandledPromiseRejection = (event) => {
// 	event.preventDefault();
// 	const error = event.reason || event.detail.reason;
// 	if (__DEV__) {
// 		const mount = getMount();
// 		const RedBox = require('redbox-react').default; // eslint-disable-line global-require
// 		ReactDOM.render(<RedBox error={error} />, mount);
// 		console.error(error);
// 	} else {
// 		console.error(error);
// 		notifyBugsnagException(error);
// 	}
// };
