/**
 * @module modules/tabs
 */
import { createAction, handleActions } from 'redux-actions';
import { Tabs, SortOrder } from '@hitask/constants/tabs';
import { StorageNames } from '@hitask/constants/storage';
import { isExtension } from '@hitask/utils/helpers';
import { getItem, setItem } from '@hitask/utils/localStorage';
import { ItemGroups } from '@hitask/constants/layout';

// ------------------------------------
// Helpers
// ------------------------------------
/**
 * Get Active Tab from client local memory synchronously
 * @function
 * @return {String} active tab
 */
const getActiveTab = () => getItem(StorageNames.activeTab) || Tabs.TODAY;

/**
 * Save Active Tab in client local memory
 * @function
 * @param {String} tabId active tab
 * @return {Boolean} save active tab
 */
export const saveActiveTab = tabId => setItem(StorageNames.activeTab, tabId);

const getTabsSortOrder = () => getItem(StorageNames.sortOrder) || SortOrder.PRIORITY.id;

const setTabsSortOrder = sortOrderId => setItem(StorageNames.sortOrder, sortOrderId);

const getItemGroupDefaultState = groupId => ({
	opened: groupId.indexOf('_MAIN') !== -1,
});

// ------------------------------------
// Constants
// ------------------------------------
export const ItemTabs = {
	id: isExtension ? 'ITEM_TABS_MINI' : 'ITEM_TABS',
	tabs: [
		{
			id: Tabs.TODAY,
			title: __T('js.tab.today'),
		},
		{
			id: Tabs.ALL_ITEMS,
			title: __T('js.tab.all_items'),
		},
	].concat(
		isExtension
			? []
			: [
					{
						id: Tabs.CALENDAR,
						title: __T('js.tab.calendar'),
					},
					{
						id: Tabs.PROJECT,
						title: __T('js.tab.project'),
					},
			  ]
	),
	itemGroups: [
		ItemGroups.TODAY_OVERDUE,
		ItemGroups.TODAY_MAIN,
		ItemGroups.TODAY_COMPLETED,
		ItemGroups.ALL_MAIN,
		ItemGroups.ALL_COMPLETED,
	],
};

const initialState = {
	activeTab: getActiveTab(),
	expandedItem: null,
	itemWithSubitemForm: null,
	sortOrder: getTabsSortOrder(),
	itemGroups: ItemTabs.itemGroups.reduce((itemGroups, groupId) => {
		itemGroups[groupId] = getItemGroupDefaultState(groupId);
		return itemGroups;
	}, {}),
};

// ------------------------------------
// Selectors
// ------------------------------------
export const activeTabSelector = state => state.tabs.activeTab;

export const expandedItemSelector = state => state.tabs.expandedItem;

export const itemWithSubitemFormSelector = state => state.tabs.itemWithSubitemForm;

export const isItemGroupOpenedSelector = (state, itemGroupId) =>
	state.tabs.itemGroups[itemGroupId].opened;

export const sortOrderSelector = state => state.tabs.sortOrder;

// ------------------------------------
// Actions
// ------------------------------------
export const selectTab = createAction('tabs/SELECT_TAB');

export const toggleItemView = createAction('tabs/TOGGLE_ITEM_VIEW');

export const toggleNewSubitemForm = createAction('tabs/TOGGLE_ADD_SUBITEM');

export const collapseAllItems = createAction('tabs/COLLAPSE_ALL_ITEMS');

export const toggleItemGroup = createAction('tabs/TOGGLE_ITEM_GROUP');

export const changeSortOrder = createAction('tabs/CHANGE_SORT_ORDER');

export const resetModule = createAction('tabs/RESET_MODULE');

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[selectTab]: (state, action) => {
		const { tabId } = action.payload;
		saveActiveTab(tabId);
		return {
			...state,
			activeTab: tabId,
		};
	},

	[toggleItemView]: (state, action) => {
		const { itemId } = action.payload;
		return {
			...state,
			expandedItem: itemId === state.expandedItem ? null : itemId,
		};
	},

	[toggleNewSubitemForm]: (state, action) => {
		const { itemId } = action.payload;
		return {
			...state,
			itemWithSubitemForm: itemId || null,
			expandedItem: null,
		};
	},

	[collapseAllItems]: state => {
		if (state.expandedItem === null) return state;
		return {
			...state,
			expandedItem: null,
		};
	},

	[toggleItemGroup]: (state, action) => {
		const itemGroupId = action.payload;
		const itemGroup = state.itemGroups[itemGroupId];
		return {
			...state,
			itemGroups: {
				...state.itemGroups,
				[itemGroupId]: {
					...state.itemGroups[itemGroupId],
					opened: !itemGroup.opened,
				},
			},
		};
	},

	[changeSortOrder]: (state, action) => {
		const { orderId } = action.payload;
		setTabsSortOrder(orderId);
		return {
			...state,
			sortOrder: orderId,
		};
	},

	[resetModule]: () => initialState,
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState);
