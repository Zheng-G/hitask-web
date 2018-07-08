/**
 * @module modules/items
 */
import { createAction, handleActions } from 'redux-actions';
import { change, formValueSelector } from 'redux-form';
import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import qs from 'qs';
import '@hitask/moment-recur';
import request, { formatHttpError } from '@hitask/utils/http';
import { Toaster, ItemCompletedToast, ItemUncompletedToast } from '@hitask/utils/Toasts';
import { openUrl, isExtension } from '@hitask/utils/helpers';
import {
	ItemCategories,
	DateQuery,
	RecurTypes,
	CustomReminderOption,
	TITLE_MAX_LENGTH,
	MESSAGE_MAX_LENGTH,
	ItemHistoryUnitTypes,
} from '@hitask/constants/item';
import {
	sortItemsHash,
	formatFetchedItem,
	formatAPIItemPost,
	formatFormItem,
	preparePostItem,
	modifyItem,
	modifyItemCascade,
	deleteItemCascade,
	updateItemObject,
	updateItemsHash,
	getItemsChildren,
	getItemSortedHierarchy,
	getItemHierarchyCollection,
	getItemAttachedFiles,
	getItemAttachmentPreviewUrl,
	getItemBaseProps,
	getNewItemPriority,
	getItemOwnerName,
	checkUserAccessToItemHierarchy,
	formatBigCalendarEventItems,
	iAmItemAdmin,
	isSubitem,
	queryItemsFilter,
	recurringItemMatchesDate,
	formItemDiff,
} from './items.logic';
import {
	getItemHistory,
	getLastComment,
	formatFetchedHistoryUnit,
	removeHistoryUnit,
	saveHistoryUnit,
} from './history.logic';

export {
	sortItemsHash,
	formatFormItem,
	checkUserAccessToItemHierarchy,
	getItemHistory,
	getItemHierarchyCollection,
	formatBigCalendarEventItems,
	getItemSortedHierarchy,
};

// ------------------------------------
// Constants
// ------------------------------------
const initialState = {
	// Items:
	items: {},
	loading: false,
	uploading: false,
	cursor: 0,
	wereLoaded: false,
	lastItemsFetchTime: null,

	// History:
	history: {},
	historyLoading: false,
	historyUploading: false,

	// Common:
	error: null,
};

export const ADD_ITEM_FORM = 'ADD_ITEM_FORM';

export const ADD_SUBITEM_FORM = 'ADD_SUBITEM_FORM';

export const EDIT_ITEM_FORM = 'EDIT_ITEM_FORM';

export const RECUR_PARAMS_FORM = 'RECUR_PARAMS_FORM';

export const SEARCH_ITEM_FORM = 'SEARCH_ITEM_FORM';

// ------------------------------------
// Selectors
// ------------------------------------
export const itemsSelector = state => state.items.items;

export const itemSelector = (state, itemId) => state.items.items[itemId];

export const historySelector = state => state.items.history;

export const projectsSelector = createSelector(itemsSelector, itemsHash =>
	Object.keys(itemsHash).reduce((acc, itemId) => {
		if (itemsHash[itemId].category === ItemCategories.PROJECT) {
			acc[itemId] = itemsHash[itemId];
		}
		return acc;
	}, {})
);

export const projectsArraySelector = createSelector(projectsSelector, projectsHash =>
	Object.keys(projectsHash).map(itemId => projectsHash[itemId].id)
);

export const itemTagsSelector = createSelector(itemsSelector, itemsHash => {
	const tagsSet = Object.keys(itemsHash).reduce((set, itemId) => {
		const itemTags = itemsHash[itemId].tags || [];
		itemTags.forEach(tag => set.add(tag));
		return set;
	}, new Set([]));
	return [...tagsSet]; // convert Set to Array
});

export const lastItemsFetchTimeSelector = state => state.items.lastItemsFetchTime;

export const wereLoadedSelector = state => state.items.wereLoaded;

// const loadingSelector = state => state.items.loading;

export const uploadingSelector = state => state.items.uploading;

const cursorSelector = state => state.items.cursor;

export const errorSelector = state => state.items.error;

export const isSubitemSelector = (state, itemId) => isSubitem(itemsSelector(state), itemId);

export const itemBasePropsSelector = (state, itemId, itemPropKeys, options) =>
	getItemBaseProps(itemsSelector(state), itemId, itemPropKeys, options);

export const itemAttachedFilesSelector = (state, itemId) =>
	getItemAttachedFiles(itemsSelector(state), itemId);

export const itemAttachmentPreviewUrlSelector = (state, attachmentId, maxSize, sizeType) =>
	getItemAttachmentPreviewUrl(itemSelector(state, attachmentId), maxSize, sizeType);

export const actualItemSelfPermissionSelector = (state, itemId) => {
	const item = itemSelector(state, itemId);
	return item ? item.permission : 0;
};

export const iAmItemAdminSelector = (state, itemId) => iAmItemAdmin(itemsSelector(state), itemId);

export const itemOwnerNameSelector = (state, itemId, teammatesNames) =>
	getItemOwnerName(itemSelector(state, itemId), teammatesNames);

export const formItemDiffSelector = (state, formItem, baseItemId) =>
	formItemDiff(formItem, itemSelector(state, baseItemId), itemsSelector(state));

/**
 * Query selector to get items from store, that match the query options
 * @function
 * @param {Object} params query params
 * @return {function} selector function, that filters with provided query params
 */
export const queryItemsSelectorFactory = ({
	/**
	 * Filter items of category, that matches the list
	 * type: array[number]
	 */
	category = [
		ItemCategories.TASK,
		ItemCategories.EVENT,
		ItemCategories.NOTE,
		ItemCategories.FILE,
	],

	/**
	 * Filter by 'completed' property.
	 * type: boolean
	 * default: undefined - pass both completed and uncompleted
	 */
	completed,

	/**
	 * Filter by item date
	 * type: array[string] || string
	 * Options:
	 *   DateQuery.TODAY - boolean: filter items for current date
	 *   DateQuery.OVERDUE - boolean, filter items for dates in the past
	 */
	date = [],

	/**
	 * Filter by item parent
	 * type: number
	 */
	parent,

	/**
	 * Leave only one item per recurring series. For API v3
	 * type: boolean
	 */
	collapseRecurring = true,
} = {}) => {
	let dateParam = null;
	if (typeof date === 'string') {
		dateParam = date;
	} else if (date.length === 1) {
		dateParam = date[0];
	} else {
		dateParam = date;
	}
	const queryParams = {
		category,
		completed,
		dateParam,
		collapseRecurring,
		parent,
	};
	return createSelector(itemsSelector, itemsHash => {
		const filteredIds = [];
		const seriesIds = [];
		return Object.keys(itemsHash)
			.filter(itemId =>
				queryItemsFilter(itemsHash[itemId].id, itemsHash, queryParams, {
					filteredIds,
					seriesIds,
				})
			)
			.reduce((acc, itemId) => {
				acc[itemId] = itemsHash[itemId];
				return acc;
			}, {});
	});
};

export const todayMainQuerySelector = queryItemsSelectorFactory({
	completed: false,
	date: DateQuery.TODAY,
});

export const todayCompletedQuerySelector = queryItemsSelectorFactory({
	completed: true,
	date: DateQuery.TODAY,
});

export const overdueQuerySelector = queryItemsSelectorFactory({
	completed: false,
	date: DateQuery.OVERDUE,
});

export const allMainQuerySelector = queryItemsSelectorFactory({
	completed: false,
});

export const allCompletedQuerySelector = queryItemsSelectorFactory({
	completed: true,
});

export const projectChildrenSelector = (state, projectId) => {
	const childrenHash = getItemsChildren(itemsSelector(state), projectId);
	return childrenHash;
};

// ------------------------------------
// Actions
// ------------------------------------
export const loading = createAction('items/LOADING');

export const uploading = createAction('items/UPLOADING');

export const historyLoading = createAction('items/HISTORY_LOADING');

export const historyUploading = createAction('items/HISTORY_UPLOADING');

export const addItem = createAction('items/ADD_ITEM', formData => (dispatch, getState) => {
	const items = itemsSelector(getState());
	return request({
		url: 'item',
		method: 'post',
		type: 'application/x-www-form-urlencoded',
		body: formatAPIItemPost(formData, items),
	});
});

export const deleteItem = createAction('items/DELETE_ITEM', itemId => dispatch => {
	dispatch(uploading());
	return request({
		url: `item/${itemId}`,
		method: 'delete',
		type: 'application/x-www-form-urlencoded',
		body: {
			cascade: true,
		},
	});
});

export const editItem = createAction('items/EDIT_ITEM', ({ itemId, changedData }) => dispatch => {
	dispatch(uploading());
	return modifyItem({
		id: itemId,
		...preparePostItem(changedData),
	});
});

export const fetchItems = createAction('items/FETCH', () => {
	return request({
		url: 'item',
	});
});

export const fetchItemsDelta = createAction('items/FETCH_DELTA', () => (dispatch, getState) => {
	const cursor = cursorSelector(getState());
	if (!cursor) {
		const error = new Error('Wrong items cursor');
		console.error(error);
		return Promise.reject(error);
	}
	return request({
		url: `item/delta/${cursor}`,
	});
});

export const insertLink = createAction(
	'items/INSERT_LINK',
	({ pageTitle = '', pageURL }) => (dispatch, getState) => {
		if (!pageURL) return;
		const form = ADD_ITEM_FORM;
		const values = formValueSelector(form)(getState(), 'title', 'message');
		if (!values.title && !values.message) {
			dispatch(change(form, 'title', pageTitle.slice(0, TITLE_MAX_LENGTH)));
			dispatch(change(form, 'message', pageURL.slice(0, MESSAGE_MAX_LENGTH)));
		} else {
			const newValue = values.message ? `${values.message} ${pageURL}` : pageURL;
			dispatch(change(form, 'message', newValue.slice(0, MESSAGE_MAX_LENGTH)));
		}
	}
);

export const submitRecurringParams = createAction(
	'items/CHANGE_RECUR_FIELDS',
	({ params, form }) => (dispatch, getState) => {
		const values = formValueSelector(form)(getState(), ...Object.keys(params));
		Object.keys(params).forEach(key => {
			if (values[key] !== params[key]) {
				dispatch(change(form, key, params[key]));
			}
		});
	}
);

export const submitNewCustomReminder = createAction(
	'items/ADD_CUSTOM_REMINDER',
	({ date, replaceIndex, form }) => (dispatch, getState) => {
		const alerts = formValueSelector(form)(getState(), 'alerts');
		const newAlert = {
			...CustomReminderOption,
			label: date.format('LLL'),
			timeSpecified: date.format(),
		};
		if (replaceIndex === -1) {
			dispatch(change(form, 'alerts', alerts.concat(newAlert)));
		} else {
			dispatch(change(form, `alerts[${replaceIndex}]`, newAlert));
		}
	}
);

export const completeItem = createAction(
	'items/COMPLETE_ITEM',
	({ itemId, completed, recurInstanceDate }) => (dispatch, getState) => {
		const item = itemSelector(getState(), itemId);
		let instanceDateTime;
		if (__API_VERSION__ === 2 && item.recurType !== RecurTypes.NONE && recurInstanceDate) {
			switch (recurInstanceDate) {
				case DateQuery.TODAY:
					instanceDateTime = recurringItemMatchesDate(item, moment());
					break;
				default:
			}
		}
		dispatch(uploading());
		return modifyItem({
			id: itemId,
			completed,
			cascade: 1,
			instance_date_time: instanceDateTime && instanceDateTime.toISOString(),
		});
	}
);

export const allowItemAccess = createAction(
	'items/ALLOW_ITEM_ACCESS',
	({ itemId, userId, level }) => (dispatch, getState) => {
		const item = itemSelector(getState(), itemId);
		if (item.permissions.find(perm => perm.principal === userId.toString()))
			return Promise.resolve(); // User already has access to the item
		const permissions = item.permissions.concat([
			{
				principal: userId,
				level,
			},
		]);
		dispatch(uploading());
		return modifyItem({
			id: itemId,
			permissions,
			cascadeAcl: 1,
		});
	}
);

export const changeItemPriority = createAction(
	'items/CHANGE_PRIORITY',
	({ sourceItemId, targetItemId, insertType }) => (dispatch, getState) => {
		const itemsHash = itemsSelector(getState());
		const priority = getNewItemPriority(itemsHash, sourceItemId, targetItemId, insertType);
		if (!priority) return null;
		return modifyItem({
			id: sourceItemId,
			priority,
		});
	}
);

export const addComment = createAction(
	'items/ADD_COMMENT',
	({ itemId, userId, message }) => dispatch => {
		dispatch(historyUploading());
		return request({
			url: 'item/comment',
			method: 'post',
			type: 'application/x-www-form-urlencoded',
			body: {
				id: itemId,
				userId,
				message,
			},
		});
	}
);

export const deleteComment = createAction('items/DELETE_COMMENT', ({ commentId, itemId }) =>
	request({
		url: 'item/comment',
		method: 'delete',
		type: 'application/x-www-form-urlencoded',
		body: {
			id: commentId,
			itemId,
		},
	})
);

export const loadHistory = createAction('items/LOAD_HISTORY', ({ itemId }) => dispatch => {
	dispatch(historyLoading());
	return request({
		url: 'item/history',
		type: 'application/x-www-form-urlencoded',
		params: {
			id: itemId,
		},
	});
});

export const setItemRead = createAction('items/SET_READ', ({ itemId, itemGuid }) => {
	request({
		url: `item/read/${itemGuid}`,
		method: 'get',
		type: 'application/x-www-form-urlencoded',
		body: {
			itemId,
		},
	});
	return { itemId };
});

export const requestFile = createAction('items/GET_FILE_DATA', ({ fileItemId }) =>
	request({
		url: 'file/url',
		params: {
			id: fileItemId,
		},
	})
);

export const clearError = createAction('items/CLEAR_ERROR');

export const resetModule = createAction('items/RESET_MODULE');

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[addItem]: {
		next: (state, action) => {
			const newItem = formatFetchedItem(action.payload.data);
			if (!newItem.id) {
				return {
					...state,
					uploading: false,
				};
			}
			return {
				...state,
				items: {
					...state.items,
					[newItem.id]: newItem,
				},
				uploading: false,
			};
		},
		throw: (state, action) => ({
			...state,
			uploading: false,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_add_item'),
			}),
		}),
	},

	[deleteItem]: {
		next: (state, action) => {
			const match = action.payload.config.url.match(/\/item\/(\d+)$/);
			if (!match) {
				return {
					...state,
					uploading: false,
				};
			}
			const itemId = parseInt(match[1], 10);
			return {
				...state,
				items: deleteItemCascade(state.items, itemId),
				uploading: false,
			};
		},
		throw: (state, action) => ({
			...state,
			uploading: false,
			error: formatHttpError(action.payload),
		}),
	},

	[editItem]: {
		next: (state, action) => {
			const newItem = formatFetchedItem(action.payload.data);
			if (!newItem.id) {
				return {
					...state,
					uploading: false,
				};
			}
			return {
				...state,
				items: {
					...state.items,
					[newItem.id]: newItem,
				},
				uploading: false,
			};
		},
		throw: (state, action) => ({
			...state,
			uploading: false,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_edit_item'),
			}),
		}),
	},

	[fetchItems]: {
		next: (state, action) => {
			const newItemsHash = updateItemsHash(state.items, action.payload.data);
			return {
				...state,
				items: newItemsHash,
				cursor: action.payload.headers['x-cursor'] || 0,
				lastItemsFetchTime: isExtension ? Date.now() : null,
				loading: false,
				wereLoaded: true,
			};
		},
		throw: (state, action) => ({
			...state,
			loading: false,
			wereLoaded: true,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_load_items'),
			}),
		}),
	},

	[fetchItemsDelta]: {
		next: (state, action) => {
			const newItemsHash = updateItemsHash(state.items, action.payload.data);
			return {
				...state,
				items: newItemsHash,
				cursor: action.payload.headers['X-Cursor'] || 0,
				lastItemsFetchTime: isExtension ? Date.now() : null,
				loading: false,
				wereLoaded: true,
			};
		},
		throw: (state, action) => ({
			...state,
			loading: false,
			wereLoaded: true,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_load_items'),
			}),
		}),
	},

	[completeItem]: {
		next: (state, action) => {
			const updatedItem = formatFetchedItem(action.payload.data);
			const { id: itemId, completed } = updatedItem;
			const item = state.items[itemId];
			if (!item) {
				return {
					...state,
					uploading: false,
				};
			}
			Toaster.show(completed ? ItemCompletedToast() : ItemUncompletedToast());
			if (__API_VERSION__ === 2 && item.recurType !== RecurTypes.NONE) {
				return {
					...state,
					uploading: false,
					items: {
						...state.items,
						[itemId]: updateItemObject(state.items[itemId], updatedItem),
					},
				};
			}
			if (!completed) {
				return {
					...state,
					uploading: false,
					items: {
						...state.items,
						[itemId]: {
							...state.items[itemId],
							completed: false,
						},
					},
				};
			}
			return {
				...state,
				uploading: false,
				items: modifyItemCascade(state.items, itemId, {
					completed: true,
				}),
			};
		},
		throw: (state, action) => ({
			...state,
			uploading: false,
			error: formatHttpError(action.payload, {
				message: __T('js.errors.failed_to_modify_item'),
			}),
		}),
	},

	[allowItemAccess]: {
		next: (state, action) => {
			if (!action.payload) return state; // Action was dismissed in the action creator
			const updatedItem = formatFetchedItem(action.payload.data);
			const { id: itemId } = updatedItem;
			if (!itemId) {
				return {
					...state,
					uploading: false,
				};
			}
			return {
				...state,
				uploading: false,
				items: {
					...state.items,
					[itemId]: updateItemObject(state.items[itemId], updatedItem),
				},
			};
		},
		throw: (state, action) => ({
			...state,
			uploading: false,
			error: formatHttpError(action.payload),
		}),
	},

	[changeItemPriority]: {
		next: (state, action) => {
			if (!action.payload) return state; // Action was dismissed in the action creator
			const updatedItem = formatFetchedItem(action.payload.data);
			const { id: itemId } = updatedItem;
			if (!itemId) {
				return {
					...state,
					uploading: false,
				};
			}
			return {
				...state,
				uploading: false,
				items: {
					...state.items,
					[itemId]: updateItemObject(state.items[itemId], updatedItem),
				},
			};
		},
		throw: (state, action) => ({
			...state,
			uploading: false,
			error: formatHttpError(action.payload),
		}),
	},

	[addComment]: {
		next: (state, action) => {
			if (action.payload.data.__mockResponse) {
				return {
					...state,
					historyUploading: false,
				};
			}

			const { id: itemIdStr, userId: userIdStr, message } = qs.parse(
				action.payload.config.data
			);
			const { id: commentId, time_create: time } = action.payload.data;
			const itemId = parseInt(itemIdStr, 10);
			const userId = parseInt(userIdStr, 10);
			const comment = {
				id: commentId,
				value: message,
				time,
				userId,
				propName: ItemHistoryUnitTypes.COMMENT_ADDED,
			};
			const itemChanges = {
				lastComment: comment.value,
				lastCommentId: comment.id,
				lastCommentCreateDate: comment.time,
				lastCommentUserId: comment.userId,
			};
			return {
				...state,
				items: {
					...state.items,
					[itemId]: {
						...state.items[itemId],
						...itemChanges,
					},
				},
				history: {
					...state.history,
					[itemId]: saveHistoryUnit(state.history[itemId], comment),
				},
				historyUploading: false,
			};
		},
		throw: (state, action) => ({
			...state,
			error: formatHttpError(action.payload),
		}),
	},

	[deleteComment]: {
		next: (state, action) => {
			if (action.payload.data.__mockResponse) return state;

			const { id: strCommentId, itemId: strItemId } = qs.parse(action.payload.config.data);
			const itemId = parseInt(strItemId, 10);
			const commentId = parseInt(strCommentId, 10);
			const item = state.items[itemId];
			const newItemHistory = removeHistoryUnit(state.history[itemId], commentId);
			const newLastComment = getLastComment(newItemHistory);
			const itemChanges =
				item.lastCommentId === commentId
					? {
							lastComment: newLastComment ? newLastComment.value : null,
							lastCommentId: newLastComment ? newLastComment.id : null,
							lastCommentCreateDate: newLastComment ? newLastComment.time : null,
							lastCommentUserId: newLastComment ? newLastComment.userId : null,
					  }
					: {};
			return {
				...state,
				items: {
					...state.items,
					[itemId]: {
						...state.items[itemId],
						...itemChanges,
					},
				},
				history: {
					...state.history,
					[itemId]: newItemHistory,
				},
			};
		},
		throw: (state, action) => ({
			...state,
			error: formatHttpError(action.payload),
		}),
	},

	[loadHistory]: {
		next: (state, action) => {
			const { config, data = [] } = action.payload;
			const itemId = config.params.id;
			return {
				...state,
				history: {
					...state.history,
					[itemId]: data.map(formatFetchedHistoryUnit),
				},
				historyLoading: false,
			};
		},
		throw: (state, action) => ({
			...state,
			historyLoading: false,
			error: formatHttpError(action.payload),
		}),
	},

	[requestFile]: {
		next: (state, action) => {
			const { data } = action.payload;
			if (!data || !data.url) return state;
			openUrl(data.url);
			return state;
		},
		throw: (state, action) => ({
			...state,
			error: formatHttpError(action.payload),
		}),
	},

	[setItemRead]: (state, action) => {
		const { itemId } = action.payload;
		return {
			...state,
			items: {
				...state.items,
				[itemId]: {
					...state.items[itemId],
					unread: 0,
				},
			},
		};
	},

	[clearError]: state => ({
		...state,
		error: null,
	}),

	[loading]: state => ({
		...state,
		loading: true,
	}),

	[uploading]: state => ({
		...state,
		uploading: true,
	}),

	[historyLoading]: state => ({
		...state,
		historyLoading: true,
	}),

	[historyUploading]: state => ({
		...state,
		historyUploading: true,
	}),

	[resetModule]: () => initialState,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState);
