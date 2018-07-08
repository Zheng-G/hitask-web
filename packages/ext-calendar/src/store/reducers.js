import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { i18nReducer } from 'react-redux-i18n';
import appReducer from '@hitask/modules/app';
import authReducer from '@hitask/modules/auth';
import itemsReducer from '@hitask/modules/items';
import overlaysReducer from '@hitask/modules/overlays';
import userReducer from '@hitask/modules/user';
import i18nLoaderReducer from '@hitask/modules/i18n';

const makeRootReducer = asyncReducers =>
	combineReducers({
		// Common modules:
		form: formReducer,
		i18n: i18nReducer,
		i18nLoader: i18nLoaderReducer,
		app: appReducer,
		auth: authReducer,
		overlays: overlaysReducer,
		...asyncReducers,

		// Local modules:
		items: itemsReducer,
		user: userReducer,
	});

export default makeRootReducer;
