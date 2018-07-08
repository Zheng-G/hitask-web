/**
 * @module utils/helpers
 */
import moment from 'moment-timezone';
import checkIsRetina from 'is-retina';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import { Types } from '@hitask/constants/global';
import {
	Priorities,
	ItemColors,
	RecurPatterns,
	StartEndPatterns,
	ReminderTimeType,
} from '@hitask/constants/item';
import { WeekDays } from '@hitask/constants/calendar';
import { BusinessLevels, BusinessLevelsConfig } from '@hitask/constants/user';

/**
 * Check whether device has retina display
 * @constant
 * @type {Boolean}
 */
export const isRetina = checkIsRetina();

/**
 * Check if code is being run in Chrome Extension environment
 * @constant
 * @type {Boolean}
 */
export const isExtension = !!(window.chrome && window.chrome.runtime && window.chrome.runtime.id);

/**
 * Check if code is being run in Electron environment
 * @constant
 * @type {Boolean}
 */
export const isElectron = window && window.process && window.process.type;

/**
 * Helper to write loops in functional style using recursion, arrays and array methods
 * @function
 * @param {Number} length array length
 * @return {Array} created array of given length
 */
export const getArrayOfLength = (length = 0) => {
	if (length === 0) return [];
	const m = length - 1;
	return getArrayOfLength(m).concat([m]);
};

/**
 * Invert object - keys become values, values become keys
 * @function
 * @param {Object} obj target object
 * @return {Object} converted object
 */
export const invertKeysWithProps = obj => {
	const invertedObj = {};
	Object.keys(obj).forEach(key => {
		invertedObj[obj[key]] = key;
	});
	return invertedObj;
};

/**
 * Rename object keys according to the rules in renameMap
 * @function
 * @param {Object} obj target object
 * @param {Object} renameMap key-value renaming map
 * @return {Object} modified target object
 */
export const renameObjectKeys = (obj, renameMap) =>
	Object.keys(obj).reduce((acc, key) => {
		if (renameMap[key]) {
			acc[renameMap[key]] = obj[key];
		} else {
			acc[key] = obj[key];
		}
		return acc;
	}, {});

/**
 * Parse object values according to their types
 * @function
 * @param {Object} obj target object
 * @param {Object} objTypes map with types of properties
 * @return {Object} modified target object
 */
export const formatObjectTypes = (obj, objTypes) =>
	Object.keys(obj).reduce((acc, key) => {
		if (
			objTypes[key] === Types.BOOL ||
			objTypes[key] === Types.NUMBER ||
			objTypes[key] === Types.ARRAY ||
			objTypes[key] === Types.OBJECT
		) {
			acc[key] = JSON.parse(obj[key]);
		} else {
			acc[key] = obj[key];
		}
		return acc;
	}, {});

/**
 * Convert numerical priority value to string label
 * @function
 * @param {Number} priorityValue priority value
 * @return {String} priority label
 */
export const getPriorityByNumber = priorityValue => {
	if (priorityValue < Priorities.NORMAL.value) {
		return Priorities.LOW.id;
	} else if (priorityValue < Priorities.HIGH.value) {
		return Priorities.NORMAL.id;
	}
	return Priorities.HIGH.id;
};

/**
 * Get color object by numerical id
 * @function
 * @param {Number} id color id
 * @return {Object} color object. NONE color is default
 */
export const getColorById = id => {
	const key = Object.keys(ItemColors).find(colorKey => ItemColors[colorKey].id === id);
	return ItemColors[key] || ItemColors.NONE;
};

/**
 * Get avatar picture src
 * @function
 * @param {String} pictureHash hash of avatar picture
 * @param {Number} size size in px. 22, 32
 * @return {String} calculated url
 */
export const getAvatarUrl = (pictureHash, size = 22) =>
	`${__PLAY_APP_BASE_URL__}/avatar/${pictureHash}.${isRetina ? size * 2 : size}.png`;

/**
 * Uncheck loading flags in modules
 * @function
 * @param {Object} state app global state
 * @param {Array} modules modules names
 * @return {Object} modified state
 */
export const uncheckLoading = (state, modules = []) =>
	modules.reduce(
		(acc, moduleId) => {
			if (!acc[moduleId]) return acc;
			if (acc[moduleId].loading) {
				acc[moduleId].loading = false;
			}
			if (acc[moduleId].uploading) {
				acc[moduleId].uploading = false;
			}
			return acc;
		},
		{ ...state }
	);

/**
 * Get recurring pattern object by it's id
 * @function
 * @param {String} id recurring id
 * @return {Object} recurring pattern
 */
export const getRecurPatternById = id => {
	const recurKey = Object.keys(RecurPatterns).find(key => RecurPatterns[key].id === id);
	return RecurPatterns[recurKey];
};

/**
 * Count checked recurring weekdays in form state
 * @function
 * @param {Object} recurState state of recurring data
 * @return {Number} calculated sum
 */
export const countCheckedWeekdays = recurState =>
	Object.keys(WeekDays).reduce((count, dayId) => {
		let result = count;
		if (recurState[`recurOn${dayId}`]) {
			result += 1;
		}
		return result;
	}, 0);

/**
 * Recognize date-time pattern, based on item date properties
 * @function
 * @param {Object} dateTimeData object with dates properties
 * @return {Number} one of StartEndPatterns
 */
export const getStartEndPattern = ({ startDate, startTime, endDate, endTime }) => {
	if (startDate) {
		if (endDate) {
			if (moment(startDate).isSame(endDate, 'day')) {
				return endTime
					? StartEndPatterns.START_END_TIME_SAME
					: StartEndPatterns.START_END_SAME;
			}
			return endTime ? StartEndPatterns.START_END_TIME : StartEndPatterns.START_END;
		}
		return startTime ? StartEndPatterns.START_TIME : StartEndPatterns.START;
	}
	if (endDate) {
		return endTime ? StartEndPatterns.END_TIME : StartEndPatterns.END;
	}
	return StartEndPatterns.EMPTY;
};

/**
 * Deep diff between two object
 * @function
 * @param  {Object} object Object compared
 * @param  {Object} base Object to compare with
 * @return {Object} Return a new object who represent the diff
 */
export const deepDiff = (object, base) => {
	const changes = Object.keys(object).reduce((acc, key) => {
		const val = base[key];
		const newVal = object[key];
		if (!_isEqual(val, newVal)) {
			acc[key] = newVal;
		}
		return acc;
	}, {});
	return _isEmpty(changes) ? false : changes;
};

/**
 * Get user business level id by number value
 * @function
 * @param {Number} levelValue value of user level
 * @return {String} id of business level
 */
export const getBusinessLevel = levelValue => {
	if (
		levelValue === BusinessLevelsConfig.TEAM.OWNER ||
		levelValue === BusinessLevelsConfig.PERSONAL.OWNER
	)
		return BusinessLevels.OWNER;
	if (
		levelValue === BusinessLevelsConfig.TEAM.ADMIN ||
		levelValue === BusinessLevelsConfig.PERSONAL.ADMIN
	)
		return BusinessLevels.ADMIN;
	if (
		levelValue === BusinessLevelsConfig.TEAM.MANAGER ||
		levelValue === BusinessLevelsConfig.PERSONAL.MANAGER
	)
		return BusinessLevels.MANAGER;
	return BusinessLevels.MEMBER;
};

/**
 * Find particular alert.
 * Search can't be done by id. Use 'timeType', 'time' and 'timeSpecified' instead
 * @function
 * @param {Object} targetAlert alert that need to find
 * @param {Array} alerts all alerts
 * @return {Object|undefined} found alert. undefined if not found
 */
export const findAlert = (targetAlert, alerts) =>
	alerts.find(
		item =>
			item.timeType === ReminderTimeType.EXACT_TIME
				? item.timeType === targetAlert.timeType &&
				  item.timeSpecified === targetAlert.timeSpecified
				: item.timeType === targetAlert.timeType && item.time === targetAlert.time
	);

/**
 * Check if object has particular props
 * @function
 * @param {Object} targetObj object to check
 * @param {Array} props required props
 * @return {Boolean} whether object has all required props or now
 */
export const checkObjectPropsExist = (targetObj, props = []) => {
	if (!targetObj) return false;
	const missingProp = props.find(key => !targetObj[key]);
	return !missingProp;
};

/**
 * Open link in separate tab
 * @param {String} url target URL
 * @return {Void} void
 */
export const openUrl = url => {
	if (isExtension) {
		if (url && url !== '#') {
			chrome.tabs.create({ url });
		}
	} else {
		window.open(url);
	}
};
