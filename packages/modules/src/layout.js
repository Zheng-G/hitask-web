/**
 * @module modules/layout
 */
import { createAction, handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
const initialState = {
	centralHeaderVisible: true,
	createFormOpened: false,
	items: {},
	projects: {},
};

const initProjectGroupState = {
	isHierarchyOpened: false,
};

// ------------------------------------
// Helpers
// ------------------------------------

// ------------------------------------
// Selectors
// ------------------------------------
export const centralHeaderVisibleSelector = state => state.layout.centralHeaderVisible;

export const createFormOpenedSelector = state => state.layout.createFormOpened;

export const isItemHierarchyOpenedSelector = (state, itemId) =>
	!!(state.layout.items[itemId] && state.layout.items[itemId].isHierarchyOpened);

export const isProjectHierarchyOpenedSelector = (state, itemId) =>
	!!(state.layout.projects[itemId] && state.layout.projects[itemId].isHierarchyOpened);

// ------------------------------------
// Actions
// ------------------------------------
export const toggleCentralHeader = createAction('layout/TOGGLE_CENTRAL_HEADER');

export const toggleCreateForm = createAction('layout/TOGGLE_CREATE_FORM');

export const toggleItemHierarchy = createAction('layout/TOGGLE_ITEM_HIERARCHY');

// export const setItemsHierarchy = createAction('layout/SET_ITEMS_HIERARCHY');

export const toggleProjectHierarchy = createAction('layout/TOGGLE_PROJECT_HIERARCHY');

export const toggleProjectGroups = createAction('layout/TOGGLE_PROJECT_GROUPS');

export const syncProjectGroups = createAction('layout/SYNC_PROJECT_GROUPS');

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[toggleCentralHeader]: (state, action) => {
		const { isOpen } = action.payload;
		if (state.centralHeaderVisible === isOpen) return state;
		return {
			...state,
			centralHeaderVisible: isOpen,
		};
	},

	[toggleCreateForm]: (state, action) => {
		const { isOpen } = action.payload;
		if (state.createFormOpened === isOpen) return state;
		return {
			...state,
			createFormOpened: isOpen,
		};
	},

	[toggleItemHierarchy]: (state, action) => {
		const { itemId, isOpen } = action.payload;
		const isOpened = state.items[itemId] && state.items[itemId].isHierarchyOpened;
		const newIsOpened = isOpen === undefined ? !isOpened : isOpen;
		return {
			...state,
			items: {
				...state.items,
				[itemId]: {
					...state.items[itemId],
					isHierarchyOpened: newIsOpened,
					id: itemId,
				},
			},
		};
	},

	// [setItemsHierarchy]: (state, action) => {
	// 	const { items, isOpen = false } = action.payload;
	// 	return {
	// 		...state,
	// 		items: Object.keys(state.items).reduce((acc, itemId) => {
	// 			if (items.find(id => id.toString() === itemId)) {
	// 				acc[itemId] = isOpen;
	// 			} else {
	// 				acc[itemId] = state.items[itemId];
	// 			}
	// 			return acc;
	// 		}, {}),
	// 	};
	// },

	[toggleProjectHierarchy]: (state, action) => {
		const { itemId, isOpen } = action.payload;
		const isOpened = state.projects[itemId] && state.projects[itemId].isHierarchyOpened;
		const newIsOpened = isOpen === undefined ? !isOpened : isOpen;
		return {
			...state,
			projects: {
				...state.projects,
				[itemId]: {
					...state.projects[itemId],
					isHierarchyOpened: newIsOpened,
					id: itemId,
				},
			},
		};
	},

	[toggleProjectGroups]: (state, action) => {
		const { itemId } = action.payload;
		const isProjectOpened = state.projects[itemId] && state.projects[itemId].isHierarchyOpened;
		return {
			...state,
			projects: Object.keys(state.projects).reduce((acc, projectId) => {
				acc[projectId] = {
					...state.projects[projectId],
					isHierarchyOpened: !isProjectOpened,
				};
				return acc;
			}, {}),
		};
	},

	[syncProjectGroups]: (state, action) => {
		const { projects } = action.payload; // projects - Array of numbers (ids)
		return {
			...state,
			projects: projects.reduce((acc, projectId) => {
				acc[projectId] = {
					...initProjectGroupState,
					...state.projects[projectId], // Persist existing project state
					id: projectId,
				};
				return acc;
			}, {}),
		};
	},
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState);
