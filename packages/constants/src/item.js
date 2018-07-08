/**
 * @module constants/item
 */
import { Types } from './global';
import Palette from './palette';

/**
 * Available item categories
 * @enum {Number}
 */
export const ItemCategories = {
	PROJECT: 0,
	TASK: 1,
	EVENT: 2,
	NOTE: 4,
	FILE: 5,
};

/**
 * Available item recurring types
 * @enum {Number}
 */
export const RecurTypes = {
	NONE: 0,
	DAILY: 1,
	WEEKLY: 2,
	MONTHLY: 3,
	YEARLY: 4,
};

/**
 * Available item recurring patterns
 * @enum {Object}
 */
export const RecurPatterns = {
	NONE: {
		id: RecurTypes.NONE,
		label: __T('js.task.recurring_none'),
	},
	DAILY: {
		id: RecurTypes.DAILY,
		label: __T('js.task.recurring_daily'),
		recurIntervalSize: 30,
	},
	WEEKLY: {
		id: RecurTypes.WEEKLY,
		label: __T('js.task.recurring_weekly'),
		recurIntervalSize: 52,
		recurOnDayEnabled: __API_VERSION__ === 3,
	},
	MONTHLY: {
		id: RecurTypes.MONTHLY,
		label: __T('js.task.recurring_monthly'),
		recurIntervalSize: 11,
		recurByTypeEnabled: __API_VERSION__ === 3,
	},
	YEARLY: {
		id: RecurTypes.YEARLY,
		label: __T('js.task.recurring_yearly'),
		recurIntervalSize: 25,
	},
	WEEKDAYS: {
		id: RecurTypes.WEEKLY * 10,
		label: __T('js.task.recurring_weekdays'),
		disabled: __API_VERSION__ === 2,
	},
};

/**
 * Whether 'recurring never end' option enabled
 * @constant
 */
export const recurNeverEndEnabled = __API_VERSION__ === 3;

/**
 * Available 'recurringBy' options
 * @enum {String}
 */
export const RecurByTypes = {
	BYDAY: 'BYDAY',
	BYWEEKNO: 'BYWEEKNO',
	BYMONTH: 'BYMONTH',
	BYMONTHDAY: 'BYMONTHDAY',
	BYYEARDAY: 'BYYEARDAY',
};

/**
 * Available 'recurringByDay' options
 * @enum {String}
 */
export const RecurByDayTypes = {
	SUN: 'SU',
	MON: 'MO',
	TUE: 'TU',
	WED: 'WE',
	THU: 'TH',
	FRI: 'FR',
	SAT: 'SA',
	orderDay: (dayId, orederNumber) => `${orederNumber}${RecurByDayTypes[dayId]}`,
};

/**
 * Available 'recurringBy' patterns
 * @enum {Object}
 */
export const RecurBy = {
	MONTH: {
		id: 'MONTH',
		label: __T('js.task.recurring_by_month'),
	},
	WEEK: {
		id: 'WEEK',
		label: __T('js.task.recurring_by_week'),
	},
};

/**
 * Available statuses of recurring instance.
 * In API v2
 * @enum {Number}
 */
export const RecurInstanceStatus = {
	UNCOMPLETED: 0,
	COMPLETED: 1,
};

/**
 * Available options for date query in item lists
 * @enum {String}
 */
export const DateQuery = {
	WITH_DATE: 'WITH_DATE',
	TODAY: 'TODAY',
	OVERDUE: 'OVERDUE',
};

/**
 * Available item color options
 * See https://hitask.red/projects/hitask-documentation/wiki/Style_Guide
 * @enum {Object}
 */
export const ItemColors = {
	NONE: {
		id: 0,
		name: 'NONE',
	},
	RED: {
		value: Palette.RED1,
		id: 1,
		name: 'RED',
	},
	ORANGE: {
		value: Palette.ORANGE1,
		id: 2,
		name: 'ORANGE',
	},
	YELLOW: {
		value: Palette.YELLOW1,
		id: 3,
		name: 'YELLOW',
	},
	GREEN: {
		value: Palette.GREEN1,
		id: 4,
		name: 'GREEN',
	},
	BLUE: {
		value: Palette.BLUE1,
		id: 5,
		name: 'BLUE',
	},
	PURPLE: {
		value: Palette.PURPLE1,
		id: 6,
		name: 'PURPLE',
	},
	BROWN: {
		value: Palette.BROWN1,
		id: 7,
		name: 'BROWN',
	},
};

/**
 * Available item priority options
 * @enum {String|Number}
 */
export const Priorities = {
	LOW: {
		id: 'LOW',
		value: 10000,
		label: __T('js.task.priority_low'),
	},
	NORMAL: {
		id: 'NORMAL',
		value: 20000,
		label: __T('js.task.priority_medium'),
	},
	HIGH: {
		id: 'HIGH',
		value: 30000,
		label: __T('js.task.priority_high'),
	},
};

/**
 * Maximum length of item title
 * @constant
 */
export const TITLE_MAX_LENGTH = 256;

/**
 * Maximum length of item message
 * @constant
 */
export const MESSAGE_MAX_LENGTH = 10000;

/**
 * Interval of item sync process. In sec
 * @constant
 */
export const CONTRACTS_BUSINESS_UPDATE_INTERVAL = 60 * 1000;
export const PREFS_UPDATE_INTERVAL = 60 * 1000;
export const ITEMS_UPDATE_INTERVAL = 60 * 1000;

export const StartEndPatterns = {
	EMPTY: 0, // all fields are empty
	START: 1, // only startDate field set
	START_TIME: 2, // startDate and startTime
	START_END_SAME: 3, // startDate and endDate days are equal. No time
	START_END_TIME_SAME: 4, // startDate and endDate, different. No time
	START_END: 5, // startDate, endDate
	START_END_TIME: 6, // startDate, startTime, endDate, endTime
	END: 7, // endDate, no time
	END_TIME: 8, // endDate and endTime
};

export const ReorderListItemTypes = {
	BEFORE: 'BEFORE',
	AFTER: 'AFTER',
};

export const ReminderTimeType = {
	EXACT_TIME: 1,
	DAYS: 2,
	HOURS: 3,
	MINUTES: 4,
};

// TODO: localize
export const ReminderOptions = [
	{
		label: 'At time of event',
		timeType: ReminderTimeType.MINUTES,
		time: 0,
		timeSpecified: null,
	},
	{
		label: '5 Minutes before',
		timeType: ReminderTimeType.MINUTES,
		time: 5,
		timeSpecified: null,
	},
	{
		label: '10 Minutes before',
		timeType: ReminderTimeType.MINUTES,
		time: 10,
		timeSpecified: null,
	},
	{
		label: '15 Minutes before',
		timeType: ReminderTimeType.MINUTES,
		time: 15,
		timeSpecified: null,
	},
	{
		label: '30 Minutes before',
		timeType: ReminderTimeType.MINUTES,
		time: 30,
		timeSpecified: null,
	},
	{
		label: '1 Hour before',
		timeType: ReminderTimeType.HOURS,
		time: 1,
		timeSpecified: null,
	},
	{
		label: '2 Hours before',
		timeType: ReminderTimeType.HOURS,
		time: 2,
		timeSpecified: null,
	},
];

export const CustomReminderOption = {
	timeType: ReminderTimeType.EXACT_TIME,
	time: 0,
	label: 'On Date...',
};

// TODO: localize labels
/**
 * Available item permission levels
 * @enum {Object}
 */
export const PermissionLevels = {
	NONE: {
		id: 0,
		label: 'None',
	},
	VIEW: {
		id: 10,
		label: 'View',
	},
	VIEW_COMMENT: {
		id: 20,
		label: 'View & Comment',
	},
	ATTACH: {
		id: 30,
		label: 'Add subtasks and attachments',
	},
	ASSIGN: {
		id: 40,
		label: 'Assign',
	},
	COMPLETE_ASSIGN: {
		id: 50,
		label: 'Complete & Assign',
	},
	MODIFY: {
		id: 60,
		label: 'Modify',
	},
	SHARE: {
		id: 70,
		label: 'Share with others',
	},
	ARCHIVE: {
		id: 80,
		label: 'Archive',
	},
	EVERYTHING: {
		id: 100,
		label: 'Everything',
	},
};

export const PermissionLevelsArray = Object.keys(PermissionLevels).map(
	key => PermissionLevels[key]
);

/**
 * Available membership levels of user in Business account
 * @enum {Number}
 */
export const BusinessLevels = {
	MEMBER: 1,
	MANAGER: 2,
	ADMIN: 10,
	OWNER: 100,
};

export const RecurFormDefaultValues = {
	recurType: RecurTypes.NONE,
	recurInterval: 1,
	recurEndDate: null,
	recurNeverEnd: false,
};

export const DateTimeFormDefaultValues = {
	startDate: null,
	startTime: null,
	endDate: null,
	endTime: null,
	isAllDay: false,
};

export const ItemFormDefaultValues = {
	title: '',
	message: '',
	starred: false,
	completed: false,
	category: ItemCategories.TASK,
	...DateTimeFormDefaultValues,
	...RecurFormDefaultValues,
	alerts: [],
	permissions: [],
	assignee: 0,
	participants: '',
	parent: 0,
	priority: Priorities.NORMAL.id, // this value converts into number in 'addItem' action
	tags: '',
	color: ItemColors.NONE.id,
	userId: null, // should be fetched from session
};

/**
 * Available types of item history events
 * @enum {String}
 */
export const ItemHistoryUnitTypes = {
	ITEM_CREATED: 'created',
	ITEM_SHARED: 'shared_with',
	COMMENT_ADDED: 'comment',
	COMMENT_DELETED: 'comment_deleted',
};

export const ItemHistoryUnitLabels = {
	[ItemHistoryUnitTypes.ITEM_CREATED]: 'Item created',
	[ItemHistoryUnitTypes.ITEM_SHARED]: 'Item shared with',
	[ItemHistoryUnitTypes.COMMENT_ADDED]: null, // Use comment text instead
	[ItemHistoryUnitTypes.COMMENT_DELETED]: 'Comment deleted',
};

/**
 * Available size types of item attachment's preview images
 * @enum {String}
 */
export const ItemAttachmentPreviewSizes = {
	PROPORTIONAL: 'PROPORTIONAL',
	SQUARE: 'SQUARE',
};

/**
 * Type shape of item object
 * @constant {Object}
 */
export const ItemShape = {
	startDate: Types.DATE,
	endDate: Types.DATE,
	dueDate: Types.DATE,
	dueDateActual: Types.DATE,
	recurEndDate: Types.DATE,
	timeCreate: Types.DATE,
	timeLastUpdate: Types.DATE,
	reminderTime: Types.DATE,
	lastCommentCreateDate: Types.DATE,
};

/**
 * Item properties, that have date format
 * @constant {Array}
 */
export const ItemDateTypeProperties = Object.keys(ItemShape).filter(
	key => ItemShape[key] === Types.DATE
);
