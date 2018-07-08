/**
 * @module constants/preferences
 */
import { WeekDays } from './calendar';
import { PermissionLevels } from './item';

/**
 * Available date format types
 * @const
 */
const DateFormatTypes = {
	DMY: 'DMY',
	MDY: 'MDY',
	YMD: 'YMD',
	ALT_DMY: 'ALT_DMY',
	ALT_MDY: 'ALT_MDY',
};

/**
 * Rename date format from API type
 * @const
 */
export const DateFormatRenameMap = {
	'd-m-y': DateFormatTypes.DMY,
	'm-d-y': DateFormatTypes.MDY,
	'y-m-d': DateFormatTypes.YMD,
	'd/m/y': DateFormatTypes.ALT_DMY,
	'm/d/y': DateFormatTypes.ALT_MDY,
};

/**
 * Available date formats
 * See http://momentjs.com/docs/#/displaying/format/
 * @const
 */
export const DateFormats = {
	[DateFormatTypes.DMY]: {
		L: 'DD/MM/YYYY',
		LL: 'D MMM YYYY',
		LLL: 'Do MMMM YYYY LT',
		LLLL: 'dddd, Do MMMM YYYY LT',
	},
	[DateFormatTypes.MDY]: {
		L: 'MM/DD/YYYY',
		LL: 'MMM D YYYY',
		LLL: 'MMMM Do YYYY LT',
		LLLL: 'dddd, MMMM Do YYYY LT',
	},
	[DateFormatTypes.YMD]: {
		L: 'YYYY/MM/DD',
		LL: 'YYYY MMM D',
		LLL: 'YYYY MMMM Do LT',
		LLLL: 'dddd, YYYY MMMM Do LT',
	},
	[DateFormatTypes.ALT_DMY]: {
		L: 'DD/MM/YYYY',
		LL: 'D/MM/YYYY',
		LLL: 'D/MM/YYYY LT',
		LLLL: 'dddd, D/MM/YYYY LT',
	},
	[DateFormatTypes.ALT_MDY]: {
		L: 'MM/DD/YYYY',
		LL: 'MM/D/YYYY',
		LLL: 'MM/D/YYYY LT',
		LLLL: 'dddd, MM/D/YYYY LT',
	},
};

/**
 * Available time format types
 * @const
 */
const TimeFormatTypes = {
	AMERICAN: 'AMERICAN',
	INTERNATIONAL: 'INTERNATIONAL',
};

/**
 * Rename time format from API type
 * @const
 */
export const TimeFormatRenameMap = {
	12: TimeFormatTypes.AMERICAN,
	24: TimeFormatTypes.INTERNATIONAL,
};

/**
 * Available time formats
 * See http://momentjs.com/docs/#/displaying/format/
 * @const
 */
export const TimeFormats = {
	[TimeFormatTypes.AMERICAN]: {
		LT: 'h:mm A',
		LTS: 'h:mm:ss A',
	},
	[TimeFormatTypes.INTERNATIONAL]: {
		LT: 'HH:mm',
		LTS: 'HH:mm:ss',
	},
};

/**
 * Default user preferences. Used while preferences are not fetched yet
 * @const
 */
export const DefaultPrefs = {
	dateFormat: DateFormats[DateFormatTypes.DMY].LL,
	timeFormat: TimeFormats[TimeFormatTypes.INTERNATIONAL].LT,
	firstDayOfWeek: WeekDays.SUN.num,
	locale: 'en',
	themeDesktop: 0,
	defaultSharingPermission: PermissionLevels.COMPLETE_ASSIGN.id,
};
