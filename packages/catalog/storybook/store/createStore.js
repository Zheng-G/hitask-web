import { applyMiddleware, compose, createStore } from 'redux';
import { syncTranslationWithStore } from 'react-redux-i18n';
import makeRootReducer from './reducers';

export default (initialState = {}) => {
	// -----------------------------------------------------------
	// Middleware Configuration
	// -----------------------------------------------------------
	const middleware = [];

	// -----------------------------------------------------------
	// Store Enhancers
	// -----------------------------------------------------------
	const enhancers = [];

	// -----------------------------------------------------------
	// Store Instantiation and HMR Setup
	// -----------------------------------------------------------
	const store = createStore(
		makeRootReducer(),
		initialState,
		compose(applyMiddleware(...middleware), ...enhancers)
	);

	store.asyncReducers = {};
	syncTranslationWithStore(store);

	return store;
};
