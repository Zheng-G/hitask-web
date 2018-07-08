import { combineReducers } from 'redux';
import { i18nReducer } from 'react-redux-i18n';

const makeRootReducer = asyncReducers =>
	combineReducers({
		i18n: i18nReducer,
		// Local modules:
		...asyncReducers,
	});

export default makeRootReducer;
