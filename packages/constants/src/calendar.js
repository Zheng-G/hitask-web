/**
 * @module constants/calendar
 */
import moment from 'moment-timezone';

/**
 * Weekday objects
 * @enum {Object}
 */
export const WeekDays = {
	SUN: {
		num: 0,
		id: 'SUN',
	},
	MON: {
		num: 1,
		id: 'MON',
	},
	TUE: {
		num: 2,
		id: 'TUE',
	},
	WED: {
		num: 3,
		id: 'WED',
	},
	THU: {
		num: 4,
		id: 'THU',
	},
	FRI: {
		num: 5,
		id: 'FRI',
	},
	SAT: {
		num: 6,
		id: 'SAT',
	},
};

/**
 * Format of date object the API requires.
 * See reference http://momentjs.com/docs/#/displaying/format/
 * @constant
 */
export const DATE_API_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

/*
 * IMPORTANT
 * When you get date from user or generate new date - always set timezone with tz(getTimeZone())
 */

/**
 * Get default time object
 * @function
 * @return {Moment} resut date
 */
export const getDefaultTime = () =>
	moment()
		.startOf('day')
		.tz(moment.tz.guess())
		.hours(12);

/**
 * Get current date with zero time fields
 * @function
 * @return {Moment} result date
 */
export const getZeroTime = () =>
	moment()
		.tz(moment.tz.guess())
		.startOf('day')
		.hours(0);

/**
 * Get maximum supported date
 * @function
 * @return {Moment} result date
 */
export const getMaxPossibleDate = () =>
	moment()
		.startOf('day')
		.add(50, 'years');
