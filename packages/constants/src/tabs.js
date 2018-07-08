/**
 * @module constants/tabs
 */

/**
 * Available list tabs
 * @enum {String}
 */
export const Tabs = {
	ACTIVITY: 'ACTIVITY',
	TODAY: 'TODAY',
	ALL_ITEMS: 'ALL_ITEMS',
	CALENDAR: 'CALENDAR',
	COLOR: 'COLOR',
	PROJECT: 'PROJECT',
	TEAM: 'TEAM',
	OVERDUE: 'OVERDUE',
};

/**
 * Available sorting options
 * @enum {Object}
 */
export const SortOrder = {
	ALPHABET: {
		id: 'ALPHABET',
		label: __T('hi.common.sort_subject'),
	},
	PRIORITY: {
		id: 'PRIORITY',
		label: __T('hi.common.sort_priority'),
	},
	LAST_MODIFIED: {
		id: 'LAST_MODIFIED',
		label: __T('hi.common.sort_last_modified'),
	},
	START_DATE: {
		id: 'START_DATE',
		label: __T('hi.common.sort_start_date'),
	},
	END_DATE: {
		id: 'END_DATE',
		label: __T('hi.common.sort_due_date'),
	},
};
