/**
 * @module modules/overlays
 */
import { createAction, handleActions } from 'redux-actions';
import { I18n } from 'react-redux-i18n';

// ------------------------------------
// Constants
// ------------------------------------
export const Overlays = {
	NEW_ITEM_CREATE_SUCCESS: 'NEW_ITEM_CREATE_SUCCESS',
	NEW_ITEM_CREATE_FAIL: 'NEW_ITEM_CREATE_FAIL',
	EDIT_ITEM_FORM: 'EDIT_ITEM_FORM',
	RECURRING_FORM: 'RECURRING_FORM',
	ITEM_VIEW: 'ITEM_VIEW',
	CONFIRM_ITEM_COMPLETE: 'CONFIRM_ITEM_COMPLETE',
	INFO_MESSAGE: 'INFO_MESSAGE',
	CUSTOM_REMINDER: 'CUSTOM_REMINDER',
	PARENT_ITEM_ACCESS: 'PARENT_ITEM_ACCESS',
	IMPORT_SUCCEED: 'IMPORT_SUCCEED',
	APP_UPDATE: 'APP_UPDATE',
};

// ------------------------------------
// Selectors
// ------------------------------------
export const isOpenSelector = (state, overlayName) => state.overlays.overlays[overlayName].isOpen;

export const propsSelector = (state, overlayName) =>
	state.overlays.overlays[overlayName].props || {};

// ------------------------------------
// Actions
// ------------------------------------
export const openOverlay = createAction('overlays/OPEN');
export const closeOverlay = createAction('overlays/CLOSE');
export const toggleOverlay = createAction('overlays/TOGGLE');
export const closeAllOverlays = createAction('overlays/CLOSE_ALL', () => (dispatch, getState) => {
	const { overlays: { overlays } } = getState();
	Object.keys(overlays).forEach(overlayName => {
		if (overlays[overlayName].isOpen) {
			dispatch(closeOverlay({ name: overlayName }));
		}
	});
});

export const openNoPermissionAlert = createAction(
	'overlays/OPEN_NO_PERMISSION',
	({ actionType, itemOwnerName, onClose }) => dispatch =>
		dispatch(
			openOverlay({
				name: Overlays.INFO_MESSAGE,
				props: {
					title: I18n.t(__T('hi.common.not_permitted')),
					message: I18n.t(__T('js.common.not_permitted_warning'))
						.replace(/\$\{0}/, actionType)
						.replace(/\$\{1}/, itemOwnerName)
						.replace(/\$\{2}/, actionType),
					onClose,
				},
			})
		)
);

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
	[openOverlay]: {
		next: (state, action) => {
			const newState = { ...state };
			const { name, props } = action.payload;
			newState.overlays[name] = {
				isOpen: true,
				props,
			};
			return newState;
		},
	},

	[closeOverlay]: {
		next: (state, action) => {
			const newState = { ...state };
			const { name } = action.payload;
			newState.overlays[name] = {
				isOpen: false,
			};
			return newState;
		},
	},

	[toggleOverlay]: {
		next: (state, action) => {
			const newState = { ...state };
			const { name, props } = action.payload;
			newState.overlays[name] = {
				isOpen: !state.overlays[name].isOpen,
				props,
			};
			return newState;
		},
	},
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialOverlays = {};
Object.keys(Overlays).forEach(overlayName => {
	initialOverlays[overlayName] = {
		name: overlayName,
		isOpen: false,
	};
});
const initialState = {
	overlays: initialOverlays,
};

export default handleActions(ACTION_HANDLERS, initialState);
