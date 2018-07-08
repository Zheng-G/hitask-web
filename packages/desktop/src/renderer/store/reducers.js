import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { i18nReducer } from 'react-redux-i18n';
import i18nLoaderReducer from '@hitask/modules/i18n';
import appReducer from '@hitask/modules/app';
import authReducer from '@hitask/modules/auth';
import layoutReducer from '@hitask/modules/layout';
import overlaysReducer from '@hitask/modules/overlays';
import itemsReducer from '@hitask/modules/items';
import userReducer from '@hitask/modules/user';
import tabsReducer from '@hitask/modules/tabs';
import importReducer from '@hitask/modules/import';

const makeRootReducer = asyncReducers => {
	const reducers = {
		// Common modules:
		router: routerReducer,
		form: formReducer,
		i18n: i18nReducer,
		i18nLoader: i18nLoaderReducer,
		app: appReducer,
		auth: authReducer,
		layout: layoutReducer,
		overlays: overlaysReducer,
		...asyncReducers,

		// Local route-specific modules:
		items: itemsReducer,
		user: userReducer,
		tabs: tabsReducer,
	};
	if (__ENABLE_IMPORT__) {
		reducers.import = importReducer;
	}
	return combineReducers(reducers);
};

export default makeRootReducer;
