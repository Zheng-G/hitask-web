/**
 * @module modules/import
 */
import { createAction, handleActions } from 'redux-actions';
import { normalize, schema } from 'normalizr';
import request, { formatHttpError } from '@hitask/utils/http';

// ------------------------------------
// Constants
// ------------------------------------
const initialState = {
	uploading: false,
	parsed: null,
	error: null,
};

// ------------------------------------
// Selectors
// ------------------------------------
export const errorSelector = state => state.import.error;

export const importStateSelector = state => state.import.importState;

export const parsedEntitiesSelector = (state, key) =>
	state.import.parsed && state.import.parsed.entities[key]
		? state.import.parsed.entities[key]
		: undefined;

export const uploadingSelector = state => state.import.uploading;

// ------------------------------------
// Actions
// ------------------------------------
const uploading = createAction('import/LOADING');

export const cancel = createAction('import/CANCEL');

export const acceptFile = createAction('import/ACCEPT_FILE', file => dispatch => {
	dispatch(uploading());
	const body = new FormData();
	body.append('file', file);
	return request({
		method: 'post',
		url: 'import/upload',
		body,
		stringify: false,
	});
});

export const createTasks = createAction('import/CREATE_TASKS', () => (dispatch, getState) => {
	dispatch(uploading());
	const parsedItems = parsedEntitiesSelector(getState(), 'items');
	return request({
		method: 'post',
		url: 'import/', // FIXME: request fails without '/' in the end
		body: Object.keys(parsedItems).map(itemId => parsedItems[itemId]),
		stringify: false,
		timeout: 5 * 60 * 1000,
	});
});

export const clearError = createAction('import/CLEAR_ERROR');

// ------------------------------------
// Action Handlers
// ------------------------------------
const ItemSchema = new schema.Entity('items', undefined, {
	idAttribute: () => Math.floor(Math.random() * 10000),
});

const ACTION_HANDLERS = {
	[acceptFile]: {
		next: (state, action) => ({
			...state,
			parsed: normalize({ items: action.payload.data }, { items: [ItemSchema] }),
			uploading: false,
			error: null,
		}),
		throw: (state, action) => ({
			...state,
			uploading: false,
			parsed: null,
			error: formatHttpError(action.payload, {
				name: __T('hi.import.import_error'),
				message: __T('hi.import.failed_to_upload_items'),
			}),
		}),
	},

	[uploading]: state => ({
		...state,
		uploading: true,
	}),

	[clearError]: state => ({
		...state,
		error: null,
	}),

	[cancel]: state => ({
		...state,
		parsed: null,
		error: null,
	}),

	[createTasks]: {
		next: state => ({
			...state,
			uploading: false,
			parsed: null,
			error: null,
		}),
		throw: (state, action) => ({
			...state,
			uploading: false,
			parsed: null,
			error: formatHttpError(action.payload, {
				name: __T('hi.import.import_error'),
				message: __T('hi.import.failed_to_upload_items'),
			}),
		}),
	},
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(ACTION_HANDLERS, initialState);
