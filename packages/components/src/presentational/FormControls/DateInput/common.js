import moment from 'moment-timezone';
import { DefaultPrefs } from '@hitask/constants/preferences';
import { getTimeZone } from '@hitask/utils/DateTimeUtils';

/**
 * Application use Moment format internally. Transform any input value to Moment
 * @function
 * @param {Moment|Date|String|null|undefined} date input value
 * @return {Date|null} formatted date
 */
export const parseDateTimeField = date => {
	if (typeof date === 'string' || moment.isDate(date)) {
		/**
		 * IMPORTANT
		 * When you get date from user or generate new date - always set timezone with tz(getTimeZone())
		 */
		return moment(date)
			.tz(getTimeZone())
			.format();
	}
	if (moment.isMoment(date)) {
		return date;
	}
	if (date !== undefined && date !== null) {
		console.error(`Error in date parsing: ${date} is type of ${typeof date}, expected Date`);
	}
	return null;
};

export const parseDateTimeFieldIgnoreTime = date => {
	const momentDate = parseDateTimeField(date);
	if (!momentDate) return null;
	return moment(momentDate)
		.startOf('day')
		.format();
};

/**
 * DateInput accept Date object format. Transform any input value to Date
 * @function
 * @param {Moment|Date|String|null|undefined} date input value
 * @return {Date|null} formatted date
 */
export const formatDateTimeField = date => {
	if (typeof date === 'string') {
		return new Date(date);
	}
	if (moment.isMoment(date)) {
		return date.toDate();
	}
	if (moment.isDate(date)) {
		return date;
	}
	if (date !== undefined && date !== null) {
		console.error(
			`Error in date formatting: ${date} is type of ${typeof date}, expected Moment or String`
		);
	}
	return null;
};

const formatDay = (day, locale = DefaultPrefs.locale) =>
	moment(day)
		.locale(locale)
		.format('ddd ll');

const formatMonthTitle = (date, locale = DefaultPrefs.locale) =>
	moment(date)
		.locale(locale)
		.format('MMMM YYYY');

const formatWeekdayShort = (day, locale = DefaultPrefs.locale) =>
	moment()
		.locale(locale)
		._locale.weekdaysMin()[day];

const formatWeekdayLong = (day, locale = DefaultPrefs.locale) =>
	moment()
		.locale(locale)
		._locale.weekdays()[day];

const getFirstDayOfWeek = (locale = DefaultPrefs.locale) =>
	moment.localeData(locale).firstDayOfWeek();

const getMonths = (locale = DefaultPrefs.locale) => {
	const months = [];
	let i = 0;
	while (i < 12) {
		months.push(
			moment()
				.locale(locale)
				.month(i)
				.format('MMMM')
		);
		i += 1;
	}
	return months;
};

export const getInitialMonth = (value, minDate) => {
	if (!value && minDate) return formatDateTimeField(minDate);
	if (!value && !minDate) return new Date();
	return undefined;
};

export const localeUtils = {
	formatDay,
	formatMonthTitle,
	formatWeekdayShort,
	formatWeekdayLong,
	getFirstDayOfWeek,
	getMonths,
};
