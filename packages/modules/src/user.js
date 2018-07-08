/**
 * @module modules/user
 */
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import request, { formatHttpError } from '@hitask/utils/http';
import { formatObjectTypes } from '@hitask/utils/helpers';
import { Types } from '@hitask/constants/global';
import {
	DateFormatRenameMap,
	DateFormats,
	TimeFormatRenameMap,
	TimeFormats,
	DefaultPrefs,
} from '@hitask/constants/preferences';
import { SubscriptionType } from '@hitask/constants/user';

// ------------------------------------
// Constants
// ------------------------------------
const initialState = {
	pref: {},
	team: {},
	business: {},
	loading: false,
	error: null,
};

const PREFS_TYPES = {
	weekly_summary_email: Types.BOOL,
	default_assign_user: Types.NUMBER,
	first_day_of_week: Types.NUMBER,
	bigCalendarMode: Types.STRING,
	notify_app: Types.BOOL,
	notify_app_item_reminder: Types.BOOL,
	notify_email: Types.BOOL,
	notify_email_item_reminder: Types.BOOL,
	notify_web: Types.BOOL,
	notify_web_item_reminder: Types.BOOL,
	show_confirmation_complete: Types.BOOL,
	language: Types.STRING,
	locale: Types.STRING,
	time_zone: Types.STRING,
	date_format: Types.STRING,
	time_format: Types.NUMBER,
	last_created_item_type: Types.NUMBER,
	['item.action.combobutton.last-used']: Types.STRING, // eslint-disable-line no-useless-computed-key
	default_sharing_permission: Types.NUMBER,
	default_sharing_permission_last: Types.ARRAY,
	default_new_item_sharing_permission: Types.ARRAY,
	default_sharing_permission_auto: Types.ARRAY,
	tabs_display: Types.OBJECT,
	theme_desktop: Types.NUMBER,
};

// ------------------------------------
// Helpers
// ------------------------------------
const getModifiedMomentLocaleData = (
	localeData,
	{ timeFormatType, dateFormatType, firstDayOfWeek }
) => ({
	longDateFormat: {
		...TimeFormats[timeFormatType],
		...DateFormats[dateFormatType],
	},
	week: {
		dow: firstDayOfWeek,
	},
});

/**
 * Select user common data from full object
 * @function
 * @param {Object} teammate user data
 * @return {Object} profile with selected fields
 */
const getUserProfile = teammate => ({
	id: teammate.id,
	name: teammate.fullName || teammate.name,
	pictureHash: teammate.pictureHash,
	isWaiting: teammate.subscription === SubscriptionType.BUSINESS_WAIT,
});

/**
 * Get array of users common profiles
 * @function
 * @param {Object} teamHash hash of users objects
 * @return {Array} users profiles
 */
const getUsersProfiles = teamHash =>
	Object.keys(teamHash)
		.map(teammateId => teamHash[teammateId])
		.filter(teammate => !!teammate)
		.map(getUserProfile);

/**
 * Get array of users common profiles, that joined the team
 * @function
 * @param {Object} teamHash hash of users objects
 * @return {Array} users profiles
 */
const getJoinedUsersProfiles = teamHash =>
	getUsersProfiles(teamHash).filter(user => !user.isWaiting);

// ------------------------------------
// Selectors
// ------------------------------------
const dateFormatTypeSelector = createSelector(
	state => state.user.pref.date_format,
	dateFormat => DateFormatRenameMap[dateFormat]
);

export const dateFormatSelector = createSelector(
	dateFormatTypeSelector,
	dateFormatType =>
		dateFormatType && DateFormats[dateFormatType]
			? DateFormats[dateFormatType].LL
			: DefaultPrefs.dateFormat
);

const timeFormatTypeSelector = createSelector(
	state => state.user.pref.time_format,
	timeFormat => TimeFormatRenameMap[timeFormat]
);

export const firstDayOfWeekSelector = state => {
	const stateValue = state.user.pref.first_day_of_week;
	if (stateValue === undefined || stateValue === null) return DefaultPrefs.firstDayOfWeek;
	return stateValue;
};

const teammatesSelector = state => state.user.team;

export const teammateSelector = (state, userId) => state.user.team[userId];

export const teammatesProfilesSelector = createSelector(teammatesSelector, getJoinedUsersProfiles);

export const teammateProfileSelector = createSelector(teammateSelector, teammate => {
	if (!teammate) return null;
	return getUserProfile(teammate);
});

export const timeZoneSelector = state => state.user.pref.time_zone || moment.tz.guess();

export const localeSelector = state =>
	__ENABLE_LOCALES__ ? state.user.pref.language : DefaultPrefs.locale;

export const showConfirmationCompleteSelector = state => state.user.pref.show_confirmation_complete;

export const themeIdSelector = state => state.user.pref.theme_desktop;

export const defaultSharingLevelSelector = state => state.user.pref.default_sharing_permission;

export const defaultNewItemSharingValuesSelector = state =>
	state.user.pref.default_new_item_sharing_permission;

export const everyoneIdSelector = state => state.user.business.everyoneGroupId;

// const loadingSelector = state => state.user.loading;

export const errorSelector = state => state.user.error;

// ------------------------------------
// Actions
// ------------------------------------
const loading = createAction('user/LOADING');

export const loadPrefs = createAction('user/LOAD_PREFS', () => {
	return request({
		url: 'user/preferences',
	});
});

export const updatePrefs = createAction('user/UPDATE_PREFS', newPrefs =>
	request({
		url: 'user/preferences',
		method: 'post',
		body: newPrefs,
	})
);

export const instantUpdatePrefs = createAction(
	'user/INSTANT_UPDATE_PREFS',
	newPrefs => dispatch => {
		dispatch(updatePrefs(newPrefs));
		return newPrefs;
	}
);

export const applyPrefsToMomentLocale = createAction(
	'user/APPLY_LOCALE_PREFS',
	() => (dispatch, getState) => {
		const state = getState();
		const locale = localeSelector(state);
		if (!locale) return Promise.reject(new Error('Locale not found'));

		const localeData = moment.localeData(locale);
		const modifiedLocaleData = getModifiedMomentLocaleData(localeData, {
			timeFormatType: timeFormatTypeSelector(state),
			dateFormatType: dateFormatTypeSelector(state),
			firstDayOfWeek: firstDayOfWeekSelector(state),
		});
		moment.updateLocale(locale, modifiedLocaleData);
		return Promise.resolve(locale);
	}
);

export const loadContacts = createAction('user/LOAD_CONTACTS', () => {
	return request({
		url: 'contact',
		params: {
			forceSendContacts: true,
		},
	});
});

export const loadBusiness = createAction('user/LOAD_BUSINESS', () => {
	return request({
		url: 'list/business',
	});
});

export const clearError = createAction('user/CLEAR_ERROR');

export const resetModule = createAction('user/RESET_MODULE');

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[loadPrefs]: {
		next: (state, action) => ({
			...state,
			pref: formatObjectTypes(action.payload.data, PREFS_TYPES),
			loading: false,
		}),
		throw: (state, action) => ({
			...state,
			loading: false,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_load_preferences'),
			}),
		}),
	},

	[updatePrefs]: {
		next: (state, action) => {
			if (action.payload.data.__mockResponse) return state;
			const newPrefs = formatObjectTypes(action.payload.data, PREFS_TYPES);
			return {
				...state,
				pref: newPrefs,
			};
		},
		throw: (state, action) => ({
			...state,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_update_preferences'),
			}),
		}),
	},

	[instantUpdatePrefs]: (state, action) => ({
		...state,
		pref: {
			...state.pref,
			...action.payload,
		},
	}),

	[applyPrefsToMomentLocale]: {
		next: state => state,
		throw: state => state,
	},

	[loadContacts]: {
		next: (state, action) => {
			const team = action.payload.data.reduce((acc, member) => {
				acc[member.id] = member;
				return acc;
			}, {});
			return {
				...state,
				team,
				loading: false,
			};
		},
		throw: (state, action) => ({
			...state,
			loading: false,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_load_contacts'),
			}),
		}),
	},

	[loadBusiness]: {
		next: (state, action) => ({
			...state,
			business: action.payload.data,
			loading: false,
		}),
		throw: (state, action) => ({
			...state,
			loading: false,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_load_business_info'),
			}),
		}),
	},

	[loading]: state => ({
		...state,
		loading: true,
	}),

	[clearError]: state => ({
		...state,
		error: null,
	}),

	[resetModule]: () => initialState,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState);
