import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware, replace as replaceRoute } from 'react-router-redux';
import reduxThunkFsa from 'redux-thunk-fsa';
import promiseMiddleware from 'redux-promise';
import { syncTranslationWithStore } from 'react-redux-i18n';
// import webSocketConnection from '@hitask/utils/websocket/websocket-connection';
// import createWebSocketMiddleware from '@hitask/utils/websocket/websocket-middleware';
import { resetModule as resetAuthModule } from '@hitask/modules/auth';
import { resetModule as resetUserModule } from '@hitask/modules/user';
import { resetModule as resetItemsModule } from '@hitask/modules/items';
import { resetModule as resetTabsModule } from '@hitask/modules/tabs';
import { init as initAxios } from '@hitask/utils/http';
import { Routes } from '@hitask/constants/layout';
import makeRootReducer from './reducers';

export default (initialState = {}, history) => {
	// -----------------------------------------------------------
	// Middleware Configuration
	// -----------------------------------------------------------
	const middleware = [
		reduxThunkFsa,
		promiseMiddleware,
		// createWebSocketMiddleware(webSocketConnection),
		routerMiddleware(history),
	];

	// -----------------------------------------------------------
	// Store Enhancers
	// -----------------------------------------------------------
	const enhancers = [];
	let composeEnhancers = compose;

	if (__DEV__) {
		const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
		if (typeof composeWithDevToolsExtension === 'function') {
			composeEnhancers = composeWithDevToolsExtension;
		}
	}

	// -----------------------------------------------------------
	// Store Instantiation
	// -----------------------------------------------------------
	const store = createStore(
		makeRootReducer(),
		initialState,
		composeEnhancers(applyMiddleware(...middleware), ...enhancers)
	);

	store.asyncReducers = {};

	const dispatch = store.dispatch;
	const onUnAuthCb = () => {
		store.dispatch(
			replaceRoute({
				pathname: Routes.LOGIN,
				state: {
					force: true,
				},
			})
		);
		dispatch(resetAuthModule());
		dispatch(resetUserModule());
		dispatch(resetItemsModule());
		dispatch(resetTabsModule());
	};
	initAxios(store, onUnAuthCb);
	syncTranslationWithStore(store);

	// -----------------------------------------------------------
	// HMR Setup
	// -----------------------------------------------------------
	if (module.hot) {
		module.hot.accept('./reducers', () => {
			const nextMakeRootReducer = require('./reducers').default; // eslint-disable-line global-require
			store.replaceReducer(nextMakeRootReducer(store.asyncReducers));
		});
	}

	return store;
};
