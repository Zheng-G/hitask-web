/**
 * @module utils/DateTimeUtils
 */
import moment from 'moment-timezone';
import { WeekDays, DATE_API_FORMAT, getZeroTime } from '@hitask/constants/calendar';
import { DefaultPrefs } from '@hitask/constants/preferences';
import { getArrayOfLength } from './helpers';

/**
 * Get current time zone
 * @function
 * @param {String} userPrefTimeZone user timezone id
 * @return {String} calculated user timezone id
 */
export const getTimeZone = userPrefTimeZone => userPrefTimeZone || moment.tz.guess();

/*
 * IMPORTANT
 * String format is saved in store
 * Moment format used in controllers
 * When you get date from user or generate new date - always set timezone with tz(getTimeZone())
 */

/**
 * Parse date from string ISO format to Moment
 * @function
 * @param {String|undefined} date target date
 * @param {String|undefined} userTimeZone user timezone id
 * @return {Moment|undefined} formatted date
 */
export const string2moment = (date, userTimeZone = getTimeZone()) => {
	if (typeof date === 'string') {
		return moment(date).tz(userTimeZone);
	}
	if (date !== undefined && date !== null) {
		console.error(`Error in date parsing: ${date} is type of ${typeof date}, expected String`);
	}
	return undefined;
};

/**
 * Format date from Moment format to string
 * @function
 * @param {Moment} date target date
 * @return {String|undefined} formatted date
 */
export const moment2string = date => {
	if (moment.isMoment(date)) {
		return date.format(DATE_API_FORMAT);
	}
	if (date !== undefined && date !== null) {
		console.error(
			`Error in date formatting: ${date} is type of ${typeof date}, expected Moment`
		);
	}
	return undefined;
};

/**
 * Convert Date format to Moment
 * @function
 * @param {Date} date target date
 * @param {String} userTimeZone user timezone id
 * @return {Moment} formatted date
 */
export const date2moment = (date, userTimeZone = getTimeZone()) => {
	if (moment.isDate(date)) {
		return moment(date).tz(userTimeZone);
	}
	if (date !== undefined && date !== null) {
		console.error(`Error in date converting: ${date} is type of ${typeof date}, expected Date`);
	}
	return undefined;
};

/**
 * Format date string according API format
 * @function
 * @param {String} date target date
 * @return {String|undefined} formatted date
 */
export const formatAPIDateString = date => (date ? moment2string(string2moment(date)) : '');

/**
 * Get weekday object by its number.
 * Number is available via date.getDay()
 * @function
 * @param {Number} num weekday number
 * @return {String} weekday id
 */
export const getWeekDayByNumber = num => {
	const dayKey = Object.keys(WeekDays).find(key => WeekDays[key].num === num);
	return WeekDays[dayKey];
};

/**
 * Sort week days according user preference firstDayOfWeek
 * @function
 * @param {Number} firstDayOfWeek day number of first weekday
 * @return {Array} sorted day ids
 */
export const getSortedWeekDays = (firstDayOfWeek = DefaultPrefs.firstDayOfWeek) => {
	const afterStartDay = [];
	const beforeStartDay = [];
	getArrayOfLength(7).forEach(dayNum => {
		if (dayNum >= firstDayOfWeek) {
			afterStartDay.push(dayNum);
		} else {
			beforeStartDay.push(dayNum);
		}
	});
	return afterStartDay.concat(beforeStartDay).map(getWeekDayByNumber);
};

/**
 * Create moment object with date values from `date` param and time values from `time` param
 * @function
 * @param {Moment|undefined} date target date object
 * @param {Moment|undefined} time target time object
 * @return {Moment} merge result date
 */
export const mergeDateTimeObjects = (date, time = getZeroTime()) => {
	if (!date) return undefined;
	return date
		.clone()
		.hours(time.hours())
		.minutes(time.minutes())
		.seconds(time.seconds())
		.milliseconds(time.milliseconds());
};

/**
 * Set time fields to zero
 * @function
 * @param {Moment} date target date
 * @return {Moment} date without time
 */
export const resetTime = date =>
	date
		.hours(0)
		.minutes(0)
		.seconds(0)
		.milliseconds(0);

/**
 * Convert ISO date format to number format
 * @function
 * @param {String} stringDate target date
 * @return {Number} converted date
 */
export const timeISO2number = stringDate => (stringDate ? new Date(stringDate).getTime() : 0);
