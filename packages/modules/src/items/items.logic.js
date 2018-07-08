/**
 * @module modules/items
 */
import _sortBy from 'lodash/sortBy';
import _reverse from 'lodash/reverse';
import _cloneDeep from 'lodash/cloneDeep';
import _some from 'lodash/some';
import _every from 'lodash/every';
import moment from 'moment-timezone';
import '@hitask/moment-recur';
import { WeekDays } from '@hitask/constants/calendar';
import { SortOrder } from '@hitask/constants/tabs';
import {
	ItemCategories,
	Priorities,
	DateQuery,
	DateTimeFormDefaultValues,
	RecurTypes,
	RecurByTypes,
	RecurByDayTypes,
	RecurInstanceStatus,
	RecurFormDefaultValues,
	RecurBy,
	RecurPatterns,
	ItemDateTypeProperties,
	PermissionLevels,
	PermissionLevelsArray,
	ReorderListItemTypes,
	ReminderTimeType,
	ReminderOptions,
	ItemAttachmentPreviewSizes,
} from '@hitask/constants/item';
import request from '@hitask/utils/http';
import {
	formatAPIDateString,
	mergeDateTimeObjects,
	timeISO2number,
} from '@hitask/utils/DateTimeUtils';
import {
	renameObjectKeys,
	invertKeysWithProps,
	getColorById,
	deepDiff,
	getPriorityByNumber,
	findAlert,
	isRetina,
} from '@hitask/utils/helpers';

// ------------------------------------
// Constants
// ------------------------------------
export const ITEM_PROPS_RENAME_MAP = {
	startDate: 'start_date',
	endDate: 'end_date',
	dueDate: 'due_date',
	dueDateActual: 'due_date_actual',
	isAllDay: 'is_all_day',
	timeEst: 'time_est',
	timeCreate: 'time_create',
	timeLastUpdate: 'time_last_update',
	timeSpent: 'time_spent',
	timeTrack: 'time_track',
	colorValue: 'color_value',
	manyTasks: 'manytasks',
	propActUpload: 'prop_act_upload',
	issueId: 'issue_id',
	userId: 'user_id',
	shortName: 'short_name',
	completeChangedCascade: 'complete_changed_cascade',
	lastTransitionTime: 'last_transition_time',
	lastTransitionTimeFormat: 'last_transition_time_format',
	lastTransitionUser: 'last_transition_user',
	lastTransitionUserName: 'last_transition_user_name',
	lastInstanceDate: 'last_instance_date',
	publishURL: 'publish_url',
	fileSize: 'file_size',
	reminderEnabled: 'reminder_enabled',
	reminderTime: 'reminder_time',
	reminderTimeType: 'reminder_time_type',
	lastComment: 'last_comment',
	lastCommentId: 'last_comment_id',
	lastCommentUserId: 'last_comment_user_id',
	lastCommentCreateDate: 'last_comment_create_datetime',
	// Recurring settings:
	recurType: 'recurring',
	recurInterval: 'recurring_interval',
	recurEndDate: 'recurring_end_date',
	// - New recurring API (API_VERSION >= 3)
	recurByDaySUN: 'byDaySU',
	recurByDayMON: 'byDayMO',
	recurByDayTUE: 'byDayTU',
	recurByDayWED: 'byDayWE',
	recurByDayTHU: 'byDayTH',
	recurByDayFRI: 'byDayFR',
	recurByDaySAT: 'byDaySA',
	recurByWeekNo: 'byWeekNo',
	recurByMonth: 'byMonth',
	recurByMonthDay: 'byMonthDay',
	recurByYearDay: 'byYearDay',
	recurBy: 'recurring_by',
	recurCount: 'recurring_count',
};

export const PRESERVED_PROPS = [];

const NOT_STRICT_BOOL_FIELDS = ['isAllDay'];

const IGNORED_ITEM_FIELDS = {
	[ItemCategories.FILE]: [
		...Object.keys(DateTimeFormDefaultValues),
		...Object.keys(RecurFormDefaultValues),
	],
};

const PRIORITY_STEP = 10;

// ------------------------------------
// Helpers
// ------------------------------------
/**
 * Get max priority value among all items in itemsHash by priorityLevel
 * @function
 * @param {Object} itemsHash hash of items
 * @param {String} priorityLevel priority level
 * @return {Number} priority value
 */
const getMaxPriority = (itemsHash, priorityLevel) => {
	// Get minimum priority
	if (!Priorities[priorityLevel]) return null; // Unknown priority
	return Object.keys(itemsHash).reduce((max, itemId) => {
		const item = itemsHash[itemId];
		if (item.category === ItemCategories.PROJECT) return max;
		const itemPriority = item.priority;
		if (
			(priorityLevel === Priorities.LOW.id && itemPriority < Priorities.NORMAL.value) ||
			(priorityLevel === Priorities.NORMAL.id &&
				itemPriority >= Priorities.NORMAL.value &&
				itemPriority < Priorities.HIGH.value) ||
			(priorityLevel === Priorities.HIGH.id && itemPriority >= Priorities.HIGH.value)
		) {
			return Math.max(max, itemPriority);
		}
		return max;
	}, Priorities[priorityLevel].value);
};

/**
 * Get unique priority value by priorityLevel
 * @function
 * @param {Object} itemsHash hash of items
 * @param {String} priorityLevel priority level
 * @param {Number} increaseOn step to increase from current max priority
 * @return {Number} priority value
 */
const getNextPriorityByLevel = (itemsHash, priorityLevel, increaseOn = PRIORITY_STEP) => {
	let nextPriority = getMaxPriority(itemsHash, priorityLevel) + increaseOn;

	// Make sure nextPriority + 1 is not exceeding max value
	if (priorityLevel === Priorities.LOW.id) {
		nextPriority = Math.min(nextPriority, Priorities.NORMAL.value - 2);
	} else if (priorityLevel === Priorities.NORMAL.id) {
		nextPriority = Math.min(nextPriority, Priorities.HIGH.value - 2);
	} else if (priorityLevel === Priorities.HIGH.id) {
		nextPriority = Math.min(
			nextPriority,
			Priorities.HIGH.value + (Priorities.HIGH.value - Priorities.NORMAL.value - 2)
		);
	} else {
		console.error('Error in priority calculation');
	}
	return nextPriority;
};

/**
 * Format recurring data of item before POST request.
 * StartDate is required here. Date are in moment format here
 * @function
 * @param {Object} originItem item object
 * @return {Object} modified item
 */
const parseItemRecurParams = originItem => {
	const item = { ...originItem };

	// Handle recurNeverEnd
	if (item.recurNeverEnd) {
		delete item.recurEndDate;
	}
	delete item.recurNeverEnd;

	if (__API_VERSION__ <= 2) return item;

	// New recurring API handling:
	switch (item.recurType) {
		case RecurTypes.DAILY:
			break;
		case RecurTypes.WEEKLY:
			item.recurByDaySUN = item.recurOnSUN ? RecurByDayTypes[WeekDays.SUN.id] : null;
			item.recurByDayMON = item.recurOnMON ? RecurByDayTypes[WeekDays.MON.id] : null;
			item.recurByDayTUE = item.recurOnTUE ? RecurByDayTypes[WeekDays.TUE.id] : null;
			item.recurByDayWED = item.recurOnWED ? RecurByDayTypes[WeekDays.WED.id] : null;
			item.recurByDayTHU = item.recurOnTHU ? RecurByDayTypes[WeekDays.THU.id] : null;
			item.recurByDayFRI = item.recurOnFRI ? RecurByDayTypes[WeekDays.FRI.id] : null;
			item.recurByDaySAT = item.recurOnSAT ? RecurByDayTypes[WeekDays.SAT.id] : null;
			break;
		case RecurTypes.MONTHLY:
			if (item.recurBy === RecurBy.MONTH.id) {
				item.recurByMonthDay = item.startDate.date();
			} else if (item.recurBy === RecurBy.WEEK.id) {
				const dayOrder = Math.ceil(item.startDate.date() / 7);
				const dayId = item.startDate.format('ddd').toUpperCase();
				item[`recurByDay${dayId}`] = RecurByDayTypes.orderDay(dayId, dayOrder);
			}
			break;
		case RecurTypes.YEARLY:
			break;
		case RecurPatterns.WEEKDAYS.id:
			item.recurType = RecurTypes.WEEKLY;
			item.recurInterval = 1;
			item.recurByDaySUN = null;
			item.recurByDayMON = RecurByDayTypes[WeekDays.MON.id];
			item.recurByDayTUE = RecurByDayTypes[WeekDays.TUE.id];
			item.recurByDayWED = RecurByDayTypes[WeekDays.WED.id];
			item.recurByDayTHU = RecurByDayTypes[WeekDays.THU.id];
			item.recurByDayFRI = RecurByDayTypes[WeekDays.FRI.id];
			item.recurByDaySAT = null;
			break;
		default:
	}

	// Handle recurBy
	item.recurBy = JSON.stringify([
		{
			type: RecurByTypes.BYDAY,
			values: Object.keys(item)
				.filter(key => key.match(/^recurByDay/) && item[key])
				.map(key => item[key]),
		},
		{
			type: RecurByTypes.BYWEEKNO,
			values: item.recurByWeekNo ? [item.recurByWeekNo] : [],
		},
		{
			type: RecurByTypes.BYMONTH,
			values: item.recurByMonth ? [item.recurByMonth] : [],
		},
		{
			type: RecurByTypes.BYMONTHDAY,
			values: item.recurByMonthDay ? [item.recurByMonthDay] : [],
		},
		{
			type: RecurByTypes.BYYEARDAY,
			values: item.recurByYearDay ? [item.recurByYearDay] : [],
		},
	]);

	return item;
};

/**
 * Format item alerts according API rules
 * @function
 * @param {Array} alerts array of alert objects
 * @return {Array} stringified array. modified alerts
 */
const parseItemAlerts = alerts =>
	alerts.map(originAlert => {
		const alert = {
			...originAlert,
			timeSpecified: originAlert.timeSpecified
				? formatAPIDateString(originAlert.timeSpecified)
				: originAlert.timeSpecified,
		};
		delete alert.label;
		delete alert.disabled;
		return alert;
	});

/**
 * Format item alerts for usage in ItemForm
 * @param {Array|null} alerts array of alert objects
 * @return {Array|null} modified alerts
 */
const formatFormItemAlerts = alerts => {
	if (!alerts) return alerts;
	return alerts
		.map(originAlert => {
			const alert = { ...originAlert };
			if (alert.timeType === ReminderTimeType.EXACT_TIME) {
				alert.label = moment(alert.timeSpecified).format('LLL');
				return alert;
			}
			const alertOption = ReminderOptions.find(
				option => option.timeType === alert.timeType && option.time === alert.time
			);
			if (!alertOption) return null;
			alert.label = alertOption.label;
			return alert;
		})
		.filter(el => !!el);
};

/**
 * Add missing data from originAlerts to newAlerts
 * @param {Array} newAlerts modified alerts
 * @param {Array} originAlerts original alerts
 * @return {Array} alerts with missing data merged
 */
const mergeFormItemAlerts = (newAlerts, originAlerts) =>
	newAlerts.map(newAlert => {
		const originAlert = findAlert(newAlert, originAlerts);
		if (!originAlert) return newAlert;
		return {
			...originAlert,
			...newAlert,
			id: originAlert.id || newAlert.id,
		};
	});

/**
 * Make same item date-format properties to be equal
 * @param {Object} formItem form item
 * @param {Object} originItem original item
 * @return {Object} modified item
 */
const mergeEqualItemDateFields = (formItem, originItem) =>
	Object.keys(formItem).reduce((acc, propName) => {
		if (!ItemDateTypeProperties.includes(propName)) return acc;
		const originDateStr = originItem[propName];
		const formDateStr = formItem[propName];
		if (!originDateStr || !formDateStr) return acc;
		if (originDateStr === formDateStr) return acc;
		if (moment(originDateStr).isSame(formDateStr)) {
			acc[propName] = originItem[propName];
		}
		return acc;
	}, formItem);

/**
 * Merge date-time properties pair in item object
 * @function
 * @param {Object} originItem original item
 * @param {String} dateName name of date property
 * @param {String} timeName name of time property
 * @return {Object} modified item
 */
const mergeItemDateTimePair = (originItem, dateName, timeName) => {
	const item = { ...originItem };
	const dateStr = item[dateName];
	const timeStr = item[timeName];
	if (dateStr && timeStr) {
		const date = moment(dateStr);
		const time = moment(timeStr);
		item[dateName] = mergeDateTimeObjects(date, time).format();
	}
	delete item[timeName];
	return item;
};

/**
 * Parse item form values and format them according API rules
 * @function
 * @param {Object} formItem origin item
 * @param {Object} itemsHash all items
 * @return {Object} modified item
 */
const parseFormItem = (formItem, itemsHash) => {
	let item = Object.keys(formItem).reduce((acc, key) => {
		if (
			IGNORED_ITEM_FIELDS[formItem.category] &&
			IGNORED_ITEM_FIELDS[formItem.category].includes(key)
		)
			return acc;
		acc[key] = formItem[key];
		return acc;
	}, {});

	item = mergeItemDateTimePair(item, 'startDate', 'startTime');
	item = mergeItemDateTimePair(item, 'endDate', 'endTime');
	item = parseItemRecurParams(item);

	item.alerts = parseItemAlerts(item.alerts);
	item.priority = getNextPriorityByLevel(itemsHash, item.priority, PRIORITY_STEP);

	item.participants = item.participants
		? item.participants
				.split(',')
				.filter(el => !!el)
				.map(el => parseInt(el, 10))
		: [];

	item.tags = item.tags ? item.tags.split(',').filter(el => !!el) : [];

	return item;
};

/**
 * Prepare item for API post request
 * @function
 * @param {Object} originItem item object
 * @param {Boolean} removeNulls whether all null values should be removed
 * @return {Object} modified item
 */
export const preparePostItem = (originItem, { removeNulls } = {}) => {
	const item = Object.keys(originItem).reduce((acc, key) => {
		if (removeNulls && originItem[key] === null) return acc;
		const originValue = originItem[key];
		let newValue = originItem[key];
		if (ItemDateTypeProperties.includes(key)) {
			newValue = formatAPIDateString(originValue);
		}
		acc[key] = newValue;
		return acc;
	}, {});
	return renameObjectKeys(item, ITEM_PROPS_RENAME_MAP);
};

/**
 * Format item according API rules for posting to API server
 * @function
 * @param {Object} originItem original item
 * @param {Object} itemsHash hash of items
 * @return {Object} modified item
 */
export const formatAPIItemPost = (originItem, itemsHash) => {
	const item = parseFormItem(originItem, itemsHash);
	return preparePostItem(item, {
		removeNulls: true,
	});
};

/**
 * Format item from store before passing to ItemForm
 * @function
 * @param {Object} originItem item
 * @return {Object} modified item
 */
export const formatFormItem = originItem => {
	const item = { ...originItem };

	if (!item.isAllDay) {
		item.startTime = item.startDate;
		item.endTime = item.endDate;
	}

	item.alerts = formatFormItemAlerts(item.alerts);

	item.participants = item.participants ? item.participants.join(',') : null;

	item.priority = getPriorityByNumber(item.priority);

	item.tags = item.tags ? item.tags.join(',') : null;

	return item;
};

/**
 * Format item from API server before saving in store
 * @function
 * @param {Object} item origin item
 * @return {Object} formatted item
 */
export const formatFetchedItem = item => {
	const revertedItemPropsRenameMap = invertKeysWithProps(ITEM_PROPS_RENAME_MAP);
	const formattedItem = renameObjectKeys(item, revertedItemPropsRenameMap);
	return formattedItem;
};

/**
 * Remove meaningless changes from modified item
 * @function
 * @param {Object} item changed item
 * @param {Object} originItem origin item
 * @return {Object} modified item
 */
const cleanupChangedItem = (item, originItem) =>
	Object.keys(item).reduce((acc, key) => {
		const value = item[key];
		const oldValue = originItem[key];
		let needRemoving = value === undefined;
		let persistOldValue = false;

		if (value === '' && !oldValue) needRemoving = true;
		if (
			Array.isArray(value) &&
			value.length === 0 &&
			(!oldValue || (Array.isArray(oldValue) && oldValue.length === 0))
		)
			needRemoving = true;
		if (NOT_STRICT_BOOL_FIELDS.includes(key) && !!value === !!oldValue) persistOldValue = true;

		if (!needRemoving) acc[key] = persistOldValue ? originItem[key] : item[key];
		return acc;
	}, {});

/**
 * Compare two item objects
 * @function
 * @param {Object} formItem item obj with form values
 * @param {Object} baseItem item obj to compare with
 * @param {Object} itemsHash all items
 * @return {Object|false} obj with changed values, or 'false' if nothing changed
 */
export const formItemDiff = (formItem, baseItem, itemsHash) => {
	let parsedItem = parseFormItem(formItem, itemsHash);
	parsedItem = mergeEqualItemDateFields(parsedItem, baseItem);
	const originPriorityLevel = getPriorityByNumber(baseItem.priority);
	const newPriorityLevel = getPriorityByNumber(parsedItem.priority);
	if (newPriorityLevel === originPriorityLevel) {
		parsedItem.priority = baseItem.priority; // Preserve priority, if in the same level
	}
	parsedItem.alerts = mergeFormItemAlerts(parsedItem.alerts, baseItem.alerts || []);
	const clearedItem = cleanupChangedItem(parsedItem, baseItem);
	const diff = deepDiff(clearedItem, baseItem);
	return diff;
};

/**
 * Reusable function for PUT requests
 * @function
 * @param {Object} params. 'id' property is required
 * @return {Promise} HTTP request promise
 */
export const modifyItem = ({ id, ...data }) => {
	return request({
		url: `item/${id}`,
		method: 'put',
		type: 'application/x-www-form-urlencoded',
		body: {
			id,
			...data,
		},
	});
};

/**
 * Sort items hash, based on order rule
 * @function
 * @param {Object} itemsHash hash of items
 * @param {String} sortOrder sort order id
 * @return {Array} array of item IDs
 */
export const sortItemsHash = (itemsHash, sortOrder) => {
	let compareBy;
	let reverse = false;
	const sortArray = [];
	const noNeedSortArray = [];
	switch (sortOrder) {
		case SortOrder.ALPHABET.id:
			Object.keys(itemsHash).forEach(key => {
				sortArray.push({
					id: itemsHash[key].id,
					title: itemsHash[key].title.toLowerCase(),
				});
			});
			compareBy = 'title';
			break;
		case SortOrder.PRIORITY.id:
			Object.keys(itemsHash).forEach(key => {
				sortArray.push({
					id: itemsHash[key].id,
					priority: itemsHash[key].priority,
				});
			});
			compareBy = 'priority';
			reverse = true;
			break;
		case SortOrder.LAST_MODIFIED.id:
			Object.keys(itemsHash).forEach(key => {
				if (itemsHash[key].timeLastUpdate) {
					sortArray.push({
						id: itemsHash[key].id,
						title: itemsHash[key].title.toLowerCase(),
						timeLastUpdate: timeISO2number(itemsHash[key].timeLastUpdate),
					});
				} else {
					noNeedSortArray.push({
						id: itemsHash[key].id,
						title: itemsHash[key].title.toLowerCase(),
					});
				}
			});
			compareBy = 'timeLastUpdate';
			reverse = true;
			break;
		case SortOrder.START_DATE.id:
			Object.keys(itemsHash).forEach(key => {
				if (itemsHash[key].startDate) {
					sortArray.push({
						id: itemsHash[key].id,
						title: itemsHash[key].title.toLowerCase(),
						startDate: timeISO2number(itemsHash[key].startDate),
					});
				} else {
					noNeedSortArray.push({
						id: itemsHash[key].id,
						title: itemsHash[key].title.toLowerCase(),
					});
				}
			});
			compareBy = 'startDate';
			break;
		case SortOrder.END_DATE.id:
			Object.keys(itemsHash).forEach(key => {
				const endDate = timeISO2number(itemsHash[key].endDate || itemsHash[key].dueDate);
				if (endDate) {
					sortArray.push({
						id: itemsHash[key].id,
						title: itemsHash[key].title.toLowerCase(),
						endDate,
					});
				} else {
					noNeedSortArray.push({
						id: itemsHash[key].id,
						title: itemsHash[key].title.toLowerCase(),
					});
				}
			});
			compareBy = 'endDate';
			break;
		default:
			return Object.keys(itemsHash).map(stringKey => parseInt(stringKey, 10));
	}
	const sortedArray = _sortBy(sortArray, [compareBy, 'title']);
	const maybeReversedSortedArray = reverse ? _reverse(sortedArray) : sortedArray;
	const noNeedSortAlphabetic = _sortBy(noNeedSortArray, 'title');
	return maybeReversedSortedArray.concat(noNeedSortAlphabetic).map(item => parseInt(item.id, 10));
};

/**
 * Get first-level children of an item
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @param {Object} filterOptions filtering options
 * @return {Object} hash of first-level children items
 */
export const getItemsChildren = (itemsHash, itemId, filterOptions = {}) =>
	Object.keys(itemsHash).reduce((childrenHash, id) => {
		if (itemsHash[id].parent !== itemId) return childrenHash;
		const { excludeCategories, includeCategoriesOnly } = filterOptions;
		if (excludeCategories && excludeCategories.includes(itemsHash[id].category))
			return childrenHash;
		if (includeCategoriesOnly && !includeCategoriesOnly.includes(itemsHash[id].category))
			return childrenHash;
		childrenHash[id] = itemsHash[id];
		return childrenHash;
	}, {});

/**
 * Get all children of an item
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @return {Object} hash of all children items
 */
const getItemsChildrenAll = (itemsHash, itemId) => {
	const firstLevelChildren = getItemsChildren(itemsHash, itemId);
	let allChildren = { ...firstLevelChildren };
	Object.keys(firstLevelChildren).forEach(childId => {
		allChildren = {
			...allChildren,
			...getItemsChildrenAll(itemsHash, itemsHash[childId].id),
		};
	});
	return allChildren;
};

/**
 * Get all parents of the item
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @return {Array} array of parent IDs. The first element is the closest parent
 */
const getItemParentsAll = (itemsHash, itemId) => {
	const item = itemsHash[itemId];
	if (!item || !item.parent) return [];
	return [item.parent].concat(getItemParentsAll(itemsHash, item.parent));
};

/**
 * Modify item and all child items (not only 1st level) with same changes
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @param {Object} changes key-value map of target item changes
 * @return {Object} modified hash of items
 */
export const modifyItemCascade = (itemsHash, itemId, changes) => {
	const parentItem = itemsHash[itemId];
	let newItemsHash = {
		...itemsHash,
		[itemId]: {
			...parentItem,
			...changes,
		},
	};
	if (parentItem.children) {
		const children = getItemsChildrenAll(itemsHash, itemId);
		Object.keys(children).forEach(id => {
			children[id] = {
				...children[id],
				...changes,
			};
		});
		newItemsHash = {
			...newItemsHash,
			...children,
		};
	}
	return newItemsHash;
};

/**
 * Delete item and all child items (not only 1st level)
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @return {Object} modified hash of items
 */
export const deleteItemCascade = (itemsHash, itemId) => {
	const newItemsHash = { ...itemsHash };
	delete newItemsHash[itemId];
	const itemChildren = getItemsChildrenAll(newItemsHash, itemId);
	Object.keys(itemChildren).forEach(id => {
		delete newItemsHash[id];
	});
	return newItemsHash;
};

/**
 * Whether item is a subitem (has non-project parent).
 * Note: isSubitem and isTopLevel are independent params
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @return {Boolean} item passes filter or not
 */
export const isSubitem = (itemsHash, itemId) => {
	const item = itemsHash[itemId];
	if (!item.parent) return false;
	const parent = itemsHash[item.parent];
	if (!parent) {
		console.error(`Item ${item.parent} no found`);
		return false;
	}
	return parent.category !== ItemCategories.PROJECT;
};

/**
 * Get id of non-project root parent
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @return {Number|null} id of parent item or null, if such not found
 */
const getNonProjectRootParentId = (itemsHash, itemId) => {
	const item = itemsHash[itemId];
	const parent = item.parent && itemsHash[item.parent];
	if (!parent) return null;
	if (parent.category === ItemCategories.PROJECT) return null;
	if (!parent.parent) return parent.id;
	const higherNonProjectParentId = getNonProjectRootParentId(itemsHash, parent.id);
	return higherNonProjectParentId || parent.id;
};

/**
 * Does one of recurring item's entities match the date
 * @function
 * @param {Object} item target item
 * @param {Moment} date date parameter
 * @return {Moment|null} the date of recurring instance, if matches; null - if doesn't match
 */
export const recurringItemMatchesDate = (item, date) => {
	let recurSchedule = moment
		.recur({
			start: item.startDate,
			end: item.recurEndDate,
		})
		.every(item.recurInterval);
	switch (item.recurType) {
		case RecurTypes.DAILY:
			recurSchedule = recurSchedule.day();
			break;
		case RecurTypes.WEEKLY:
			recurSchedule = recurSchedule.weeks();
			break;
		case RecurTypes.MONTHLY:
			recurSchedule = recurSchedule.months();
			break;
		case RecurTypes.YEARLY:
			recurSchedule = recurSchedule.years();
			break;
		default:
	}
	if (recurSchedule.matches(date)) return date;
	if (!item.endDate) return null;
	const itemDuration = moment(item.endDate).diff(item.startDate, 'days');
	if (itemDuration > 0) {
		let i = 1;
		let pointerDate;
		while (i <= itemDuration) {
			pointerDate = date.clone().subtract(i, 'days');
			if (recurSchedule.matches(pointerDate)) return pointerDate;
			i += 1;
		}
	}
	return null;
};

/**
 * Does item dates match 'today' filter
 * @function
 * @param {Object} item target item
 * @param {Moment} now current date
 * @return {Boolean} item passes filter or not
 */
const itemIsForToday = (item, now) => {
	if (__API_VERSION__ === 2 && item.recurType !== RecurTypes.NONE)
		return recurringItemMatchesDate(item, now);
	if (!item.startDate && !item.endDate) return false;
	if (item.endDate) {
		if (item.startDate) {
			if (
				moment(now).isSameOrAfter(item.startDate, 'day') &&
				moment(now).isSameOrBefore(item.endDate, 'day')
			) {
				return true;
			}
		} else if (moment(item.endDate).isSame(now, 'day')) return true;
	} else if (moment(item.startDate).isSame(now, 'day')) return true;
	if (item.category === ItemCategories.NOTE && item.starred) return true;
	return false;
};

/**
 * Does item dates match 'overdue' filter
 * @function
 * @param {Object} item target item
 * @param {Moment} now current date
 * @return {Boolean} item passes filter or not
 */
const itemIsForOverdue = (item, now) => {
	if (item.category !== ItemCategories.TASK || (!item.startDate && !item.endDate)) return false;
	if (item.startDate) {
		const startDate = moment(item.startDate);
		if (!startDate.isBefore(now, 'day')) return false;
	}
	if (item.endDate) {
		const endDate = moment(item.endDate);
		if (!endDate.isBefore(now, 'day')) return false;
	}
	return true;
};

/**
 * Is item completed (is item completed on given date if it's a recurring item)
 * @function
 * @param {Object} item target item
 * @param {Moment} date date param
 * @return {Boolean} target item passes filter or not
 */
const itemIsCompletedForDate = (item, date) => {
	if (__API_VERSION__ === 2 && item.recurType !== RecurTypes.NONE) {
		const instanceDate = recurringItemMatchesDate(item, date);
		if (!instanceDate) return false;
		const matchedItemInstances = item.instances.filter(instance =>
			moment(instance.start_date).isSame(instanceDate, 'day')
		);
		const itemInstance = matchedItemInstances[0];
		if (!itemInstance) return false;
		switch (itemInstance.status) {
			case RecurInstanceStatus.COMPLETED:
				return true;
			default:
				return false;
		}
	}
	return !!item.completed;
};

/**
 * Update item object with new values, preserving some props
 * @function
 * @param {Object} oldItem target item
 * @param {Object} updatedItem updated target item
 * @return {Object} modified item
 */
export const updateItemObject = (oldItem, updatedItem) => {
	if (!PRESERVED_PROPS.length) return updatedItem;
	return {
		...updatedItem,
		...PRESERVED_PROPS.reduce((hash, propName) => {
			hash[propName] = oldItem[propName];
			return hash;
		}, {}),
	};
};

/**
 * Update items hash with new formatted values
 * @function
 * @param {Object} oldItemsHash hash of all items
 * @param {Array} newItems array of new items
 * @return {Object} modified hash of all items
 */
export const updateItemsHash = (oldItemsHash, newItems) => {
	const newItemsHash = newItems.reduce((acc, item) => {
		const oldItem = oldItemsHash && oldItemsHash[item.id];
		const newItem = formatFetchedItem(item);
		if (oldItem) {
			acc[item.id] = updateItemObject(oldItem, newItem);
		} else {
			acc[item.id] = newItem;
		}
		return acc;
	}, {});
	return newItemsHash;
};

/**
 * Check if item matching today list filters.
 * See spec https://hitask.red/projects/hitask-documentation/wiki/Tabs
 * @function
 * @param {Object} item target item
 * @param {Moment} now current date
 * @return {Boolean} item passes filters or not
 */
const itemMatchesTodayFilters = (item, now) => {
	if (item.category === ItemCategories.TASK || item.category === ItemCategories.EVENT) {
		if (!itemIsForToday(item, now)) return false;
	} else if (item.category === ItemCategories.NOTE) {
		if (!item.starred) return false;
	} else {
		return false;
	}
	return true;
};

/**
 * Check if item matching overdue list filters.
 * See spec https://hitask.red/projects/hitask-documentation/wiki/Tabs
 * @function
 * @param {Object} item target item
 * @param {Moment} now current date
 * @return {Boolean} item passes filters or not
 */
const itemMatchesOverdueFilters = (item, now) => {
	if (item.category === ItemCategories.TASK) {
		if (!itemIsForOverdue(item, now)) return false;
	} else {
		return false;
	}
	return true;
};

/**
 * Get item that neighbor position in the list by priority
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @param {Number} offset position offset in the sorted list (e.g. +1 means next position, -1 - previous)
 * @return {Object} neighbor item
 */
const getPriorityNeighborItem = (itemsHash, itemId, offset) => {
	const sortedIds = sortItemsHash(itemsHash, SortOrder.PRIORITY.id);
	const itemIndex = sortedIds.indexOf(itemId);
	if (itemIndex === -1) return null;
	const neighborItemIndex = itemIndex + offset;
	const normalizedNeighborItemIndex =
		neighborItemIndex < 0
			? 0
			: neighborItemIndex >= sortedIds.length
				? sortedIds.length - 1
				: neighborItemIndex;
	const neighborItemId = sortedIds[normalizedNeighborItemIndex];
	return itemsHash[neighborItemId];
};

/**
 * Calculate new item priority, based in it's new position in the list
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} sourceItemId item to be updated
 * @param {Number} targetItemId item that new position is based on
 * @param {String} insertType one of ReorderListItemTypes
 * @return {Number} new priority value
 */
export const getNewItemPriority = (itemsHash, sourceItemId, targetItemId, insertType) => {
	const targetItem = itemsHash[targetItemId];
	const neighborItem = getPriorityNeighborItem(
		itemsHash,
		targetItemId,
		insertType === ReorderListItemTypes.BEFORE ? -1 : 1
	);
	if (!neighborItem) return null; // Neighbor was not found
	if (neighborItem.id === sourceItemId) return null; // No need to move the item
	const newPriority =
		neighborItem.id === targetItem.id
			? insertType === ReorderListItemTypes.BEFORE
				? targetItem.priority + PRIORITY_STEP
				: targetItem.priority - PRIORITY_STEP
			: Math.floor((targetItem.priority + neighborItem.priority) / 2);
	return newPriority;
};

/**
 * Get a hierarchy object of items
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId parent item id
 * @param {String} sortOrder sorting order id
 * @return {Object} item with all children
 */
export const getItemSortedHierarchy = (itemsHash, itemId, sortOrder) => {
	const item = itemsHash[itemId];
	if (!item) {
		// const error = new Error(`Expected item with id ${itemId}, but none was found`);
		// console.error(error);
		// notifyBugsnagException(error);
		return {
			id: null,
			children: [],
		};
	}
	const childrenHash = getItemsChildren(itemsHash, itemId, {
		excludeCategories: [ItemCategories.FILE],
	});
	const sortedChildren = sortItemsHash(childrenHash, sortOrder);
	return {
		id: itemId,
		children: sortedChildren.map(childId =>
			getItemSortedHierarchy(itemsHash, childId, sortOrder)
		),
	};
};

/**
 * Get child file-item ids of parent item
 * @param {Object} itemsHash hash of items
 * @param {number} itemId parent item id
 * @return {Array} array of file-item ids
 */
export const getItemAttachedFiles = (itemsHash, itemId) => {
	const item = itemsHash[itemId];
	if (!item) return [];
	const childrenHash = getItemsChildren(itemsHash, itemId, {
		includeCategoriesOnly: [ItemCategories.FILE],
	});
	return Object.keys(childrenHash).map(itemIdStr => childrenHash[itemIdStr].id);
};

/**
 * Concat parent item id and all children ids into a string.
 * Used in props comparison of <HierarchyItem>
 * @function
 * @param {Object} sortedHierarchy hierarchy item with all children
 * @return {String} ids of parent item and all child items, joined by coma
 */
export const getItemHierarchyCollection = sortedHierarchy => {
	let result = [sortedHierarchy.id];
	sortedHierarchy.children.forEach(child => {
		result = result.concat(getItemHierarchyCollection(child));
	});
	return result.join(',');
};

/**
 * Deep copy of selected item properties
 * @function
 * @param {Object} item target item
 * @param {Array} itemPropKeys key names to be copied
 * @return {Object} item with copied props
 */
const copyItemProps = (item, itemPropKeys) =>
	itemPropKeys.reduce((acc, key) => {
		if (typeof item[key] === 'object') {
			acc[key] = _cloneDeep(item[key]);
		} else {
			acc[key] = item[key];
		}
		return acc;
	}, {});

/**
 * Check is item private or not
 * @param {Object} item target item
 * @return {Boolean} whether item is private or not
 */
// const itemIsPrivate = (item) => {
// 	if (!item.permissions.length) return true;
// 	if (item.permissions.length > 1) return false;
// 	if (!item.userId) return false;
// 	return item.permissions[0].principal === item.userId.toString();
// };

/**
 * Get full name of item's owner.
 * Returns null if current user is the owner
 * @function
 * @param {Object} item target item
 * @param {Array} teammatesNames full names of team members
 * @return {String} full name of the owner
 */
export const getItemOwnerName = (item, teammatesNames) => {
	const teammate = teammatesNames.find(member => member.id === item.userId);
	if (!teammate) return null;
	return teammate.name;
};

/**
 * Get actual item permission level for particular user
 * @function
 * @param {Object} item target item
 * @param {Number} userId user id
 * @param {Number} selfId current user id
 * @param {String} everyoneId everyone group principal
 * @return {Number} actual item permission level for user
 */
const getActualItemPermission = (item, userId, selfId, everyoneId) => {
	if (item.userId === userId) return PermissionLevels.EVERYTHING.id;
	if (userId === selfId) return item.permission;
	const everyonePermission = item.permissions.find(perm => perm.principal === everyoneId);
	const personalPermission = item.permissions.find(perm => perm.principal === userId.toString());
	if (personalPermission) return personalPermission.level;
	if (everyonePermission) return everyonePermission.level;
	return PermissionLevels.NONE.id;
};

/**
 * Check if user has minimum requiredLevel for the hierarchy of itemId
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId id of target item
 * @param {Number} requiredLevel permission level, required for userId
 * @param {Number} userId user id
 * @param {Number} selfId current user id
 * @param {String} everyoneId everyone group principal
 * @return {Number|false} id of highest item in the hierarchy, that is not accessed for userId.
 * Returns false if all hierarchy is accessible
 */
export const checkUserAccessToItemHierarchy = (
	itemsHash,
	itemId,
	requiredLevel,
	userId,
	selfId,
	everyoneId
) => {
	const itemParents = getItemParentsAll(itemsHash, itemId);
	const highestNonAccessedItem = itemParents.find(parentId => {
		const itemNotAccessed =
			getActualItemPermission(itemsHash[parentId], userId, selfId, everyoneId) <
			requiredLevel;
		return itemNotAccessed;
	});
	if (highestNonAccessedItem) return highestNonAccessedItem;
	const itemPermission = getActualItemPermission(itemsHash[itemId], userId, selfId, everyoneId);
	if (itemPermission < requiredLevel) return itemId;
	return false;
};

/**
 * Get selected item properties
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @param {Array} itemPropKeys key names to be copied
 * @param {Object} props other optional props
 * @return {Object} item with requested props
 */
export const getItemBaseProps = (
	itemsHash,
	itemId,
	itemPropKeys = [],
	{ recurInstanceDate, selfId, everyoneId, teammatesNames } = {}
) => {
	const item = itemsHash[itemId];
	if (!item) {
		const error = new Error(`Expected item with id ${itemId}, but none was found`);
		console.error(error);
		return null;
	}
	const now = moment();
	const baseProps = copyItemProps(item, itemPropKeys);

	if (itemPropKeys.includes('color')) {
		const itemColor = getColorById(item.color);
		baseProps.color = itemColor.name;
	}

	if (itemPropKeys.includes('parentTitle')) {
		const parent = itemsHash[item.parent];
		baseProps.parentTitle = parent ? parent.title : undefined;
	}

	const parent = item.parent && itemsHash[item.parent];
	if (itemPropKeys.includes('parentColorValue')) {
		baseProps.parentColorValue = parent ? parent.colorValue : undefined;
	}

	if (itemPropKeys.includes('parentIsProject')) {
		baseProps.parentIsProject = !!(parent && parent.category === ItemCategories.PROJECT);
	}

	if (itemPropKeys.includes('tags')) {
		baseProps.tags = baseProps.tags || [];
		baseProps.tags = baseProps.tags.join(',');
	}

	if (
		itemPropKeys.includes('permissions') ||
		itemPropKeys.includes('isPrivate') ||
		itemPropKeys.includes('hasEveryonePermission')
	) {
		const permissions = item.permissions
			.map(perm => ({ ...perm })) // Copy values of item.permissions
			.map(perm => {
				if (perm.principal === everyoneId) {
					perm.name = 'Everyone';
					perm.everyone = true;
				} else {
					const principal = parseInt(perm.principal, 10);
					perm.principal = principal;
					if (principal === selfId) {
						perm.name = 'Myself';
						perm.myself = true;
					} else {
						const teammate = teammatesNames.find(member => member.id === principal);
						if (!teammate) return null; // Team info not loaded yet. Skip the permission
						perm.name = teammate.name;
					}
				}
				const actualPerm = PermissionLevelsArray.find(level => level.id === perm.level);
				if (!actualPerm) {
					console.error(new Error(`Permission with level ${perm.level} not found`));
					return null;
				}
				perm.label = actualPerm.label;
				return perm;
			})
			.filter(perm => !!perm);

		if (itemPropKeys.includes('permissions')) {
			baseProps.permissions = permissions.map(perm => `${perm.name}|${perm.label}`).join(',');
		}

		if (itemPropKeys.includes('isPrivate')) {
			baseProps.isPrivate = permissions.length === 1 && permissions[0].myself === true;
		}

		if (itemPropKeys.includes('hasEveryonePermission')) {
			baseProps.hasEveryonePermission = !!permissions.find(perm => perm.everyone);
		}
	}

	const permLevel = item.permission;
	if (itemPropKeys.includes('forbidComplete')) {
		baseProps.forbidComplete = permLevel < PermissionLevels.COMPLETE_ASSIGN.id;
	}

	if (itemPropKeys.includes('forbidDnD')) {
		baseProps.forbidDnD = permLevel < PermissionLevels.MODIFY.id;
	}

	if (itemPropKeys.includes('forbidAttach')) {
		baseProps.forbidAttach = permLevel < PermissionLevels.ATTACH.id;
	}

	if (itemPropKeys.includes('forbidEdit')) {
		baseProps.forbidEdit = permLevel < PermissionLevels.MODIFY.id;
	}

	if (itemPropKeys.includes('forbidDelete')) {
		baseProps.forbidDelete = permLevel < PermissionLevels.EVERYTHING.id;
	}

	if (itemPropKeys.includes('ownerName')) {
		baseProps.ownerName = getItemOwnerName(item, teammatesNames);
	}

	if (itemPropKeys.includes('isSubitem')) {
		baseProps.isSubitem = isSubitem(itemsHash, item.id);
	}

	if (__API_VERSION__ === 2 && item.recurType !== RecurTypes.NONE && recurInstanceDate) {
		switch (recurInstanceDate) {
			case DateQuery.TODAY:
				baseProps.completed = itemIsCompletedForDate(item, moment());
				break;
			default:
		}
	}

	if (itemPropKeys.includes('isOverdue')) {
		baseProps.isOverdue = itemIsForOverdue(item, now);
	}

	return baseProps;
};

/**
 * Filter function for list item
 * @function
 * @param {Number} itemId target item id
 * @param {Object} itemsHash hash of items
 * @param {Object} queryParams query parameters
 * @param {Object} props other optional props
 * @return {Boolean} does target item pass filters or not
 */
export const queryItemsFilter = (itemId, itemsHash, queryParams, { filteredIds, seriesIds }) => {
	const { category, completed, dateParam, collapseRecurring, parent } = queryParams;

	// If item was already filtered, skip checking
	if (filteredIds.indexOf(itemId) !== -1) return true;

	const item = itemsHash[itemId];
	const now = moment();

	// Hierarchy filtering
	const nonProjectParentId = getNonProjectRootParentId(itemsHash, item.id);
	if (nonProjectParentId && item.category === ItemCategories.FILE) return false; // Skip all item attachments

	// Parent filtering
	if (parent && item.parent !== parent) return false;

	// Category filtering
	if (category.indexOf(item.category) === -1) return false;

	// Completion filtering
	if (completed === true) {
		if (item.parent) {
			const rootParentId = getNonProjectRootParentId(itemsHash, item.id);
			if (rootParentId) {
				// Check non-project rootParent item, if exists
				if (!itemIsCompletedForDate(itemsHash[rootParentId], now)) return false;
			} else if (!itemIsCompletedForDate(item, now)) return false;
		} else if (!itemIsCompletedForDate(item, now)) return false;
	}
	if (completed === false && itemIsCompletedForDate(item, now)) return false;

	// Recurring items filtering
	if (__API_VERSION__ > 2 && collapseRecurring && item.recurType !== RecurTypes.NONE) {
		if (seriesIds.indexOf(item.seriesId) !== -1) return false;
		seriesIds.push(item.seriesId);
	}

	// Dates filtering
	if (typeof dateParam === 'string') {
		if (dateParam === DateQuery.WITH_DATE && !(item.startDate || item.endDate)) return false;
		if (dateParam === DateQuery.TODAY && !itemMatchesTodayFilters(item, now)) return false;
		if (dateParam === DateQuery.OVERDUE && !itemMatchesOverdueFilters(item, now)) return false;
	} else if (dateParam.length) {
		const matchSomeOfOptions = _some(
			dateParam.map(dateOption => {
				switch (dateOption) {
					case DateQuery.TODAY:
						return itemMatchesTodayFilters(item, now);
					case DateQuery.OVERDUE:
						return itemMatchesOverdueFilters(item, now);
					default:
						return true;
				}
			}),
			Boolean
		);
		if (!matchSomeOfOptions) return false;
	}

	// If nonProjectParent is matching the filter, skip the item
	// This check must be the last one
	if (
		nonProjectParentId &&
		queryItemsFilter(nonProjectParentId, itemsHash, queryParams, { filteredIds, seriesIds })
	)
		return false;

	filteredIds.push(item.id);
	return true;
};

/**
 * Select preview object with maximum satisfying size
 * @param {Array} previews array of preview objects
 * @param {*} maxSize required image size
 * @return {Object} preview object
 */
const getPreviewOfMaxSize = (previews, maxSize) => {
	if (!maxSize) return null;
	const normalMaxSize = isRetina ? maxSize * 2 : maxSize;
	return previews.reduce((resultPreview, preview) => {
		if (preview.size && preview.size <= normalMaxSize) {
			if (!resultPreview) return preview;
			if (resultPreview.size < preview.size) return preview;
		}
		return resultPreview;
	}, null);
};

/**
 * Get image preview URL of file item
 * @param {Object} fileItem target file item
 * @param {Number} maxSize required image size
 * @param {String} sizeType type of image size
 * @return {String} image URL
 */
export const getItemAttachmentPreviewUrl = (
	fileItem,
	maxSize,
	sizeType = ItemAttachmentPreviewSizes.PROPORTIONAL
) => {
	if (!fileItem.previews) return null;
	if (!maxSize) {
		console.error(new Error('Specify maxSize for item preview image'));
		return null;
	}
	const targetPreviews = fileItem.previews.filter(preview => preview.type === sizeType);
	const targetPreview = getPreviewOfMaxSize(targetPreviews, maxSize);
	if (targetPreview) return targetPreview.url;
	const altPreview = getPreviewOfMaxSize(fileItem.previews, maxSize);
	return altPreview ? altPreview.url : null;
};

/**
 * Check whether current user has 'everything' permission level for target item and all it's parents
 * @param {Object} itemsHash hash of items
 * @param {Number} itemId target item id
 * @return {Boolean} image URL
 */
export const iAmItemAdmin = (itemsHash, itemId) => {
	const item = itemsHash[itemId];
	if (!item) return false;
	if (item.permission !== PermissionLevels.EVERYTHING.id) return false;
	const parents = getItemParentsAll(itemsHash, itemId);
	const allParentsPermitted = _every(
		parents,
		parentId =>
			itemsHash[parentId] && itemsHash[parentId].permission === PermissionLevels.EVERYTHING.id
	);
	return allParentsPermitted;
};

/**
 * Format shape of event items for BigCalendar
 * @function
 * @param {Object} itemsHash selected items for BigCalendar
 * @return {Array} formatted items
 */
export const formatBigCalendarEventItems = itemsHash =>
	Object.keys(itemsHash).map(itemId => {
		const item = itemsHash[itemId];
		const start = item.startDate;
		const end = item.recurType !== RecurTypes.NONE ? start : item.endDate;
		return {
			id: item.id,
			title: item.title,
			start: start || end,
			end: end || start,
			allDay: item.isAllDay,
			completed: item.completed,
		};
	});
