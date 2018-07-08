/**
 * @module modules/app
 */
import { handleActions } from 'redux-actions';

// ------------------------------------
// Selectors
// ------------------------------------
export const appVersionSelector = state => state.app.version;

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
	version: __APP_VERSION__,
	env: __ENV__,
};

export default handleActions(ACTION_HANDLERS, initialState);
