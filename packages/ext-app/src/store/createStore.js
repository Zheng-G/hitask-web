import { applyMiddleware, createStore, compose } from 'redux';
import reduxThunkFsa from 'redux-thunk-fsa';
import promiseMiddleware from 'redux-promise';
import { syncTranslationWithStore } from 'react-redux-i18n';
import { resetModule as resetAuthModule } from '@hitask/modules/auth';
import { resetModule as resetUserModule } from '@hitask/modules/user';
import { resetModule as resetItemsModule } from '@hitask/modules/items';
import { resetModule as resetTabsModule } from '@hitask/modules/tabs';
import { isExtension } from '@hitask/utils/helpers';
import storage from '@hitask/utils/extension-storage';
import { init as initAxios } from '@hitask/utils/http';
import makeRootReducer from './reducers';

// -----------------------------------------------------------
// Middleware Configuration
// -----------------------------------------------------------
const middleware = [reduxThunkFsa, promiseMiddleware];

// -----------------------------------------------------------
// Store Enhancers
// -----------------------------------------------------------
const enhancers = [];
let composeEnhancers = compose;

if (__DEV__) {
	// Enable redux debugging in non-production env
	const { composeWithDevTools: composeWithDevToolsExt } = require('redux-devtools-extension'); // eslint-disable-line global-require
	const { composeWithDevTools: composeWithDevToolsRemote } = require('remote-redux-devtools'); // eslint-disable-line global-require

	if (isExtension) {
		// https://github.com/zalmoxisus/remote-redux-devtools
		composeEnhancers = composeWithDevToolsRemote({
			realtime: true,
			hostname: __DEVTOOLS_HOST__,
			port: __DEVTOOLS_PORT__,
		});
	} else {
		// https://github.com/zalmoxisus/redux-devtools-extension
		composeEnhancers = composeWithDevToolsExt({});
	}
}

const enhancer = composeEnhancers(applyMiddleware(...middleware), ...enhancers, storage());

export default function(initialState) {
	const store = createStore(makeRootReducer(), initialState, enhancer);

	store.asyncReducers = {};

	const dispatch = store.dispatch;
	const onUnAuthCb = () => {
		dispatch(resetAuthModule());
		dispatch(resetUserModule());
		dispatch(resetItemsModule());
		dispatch(resetTabsModule());
	};
	initAxios(store, onUnAuthCb);
	syncTranslationWithStore(store);

	if (module.hot) {
		module.hot.accept('./reducers', () => {
			const nextMakeRootReducer = require('./reducers').default; // eslint-disable-line global-require
			store.replaceReducer(nextMakeRootReducer(store.asyncReducers));
		});
	}

	return store;
}
