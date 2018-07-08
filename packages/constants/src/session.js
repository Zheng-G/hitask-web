import { Types } from './global';

export const REQUIRED_SESSION_SHAPE = {
	// Reuquired session data. If some is empty, need relogin
	sessionId: Types.STRING,
	id: Types.NUMBER,
	level: Types.NUMBER,
	login: Types.STRING,
	pictureHash: Types.STRING,
	accountType: Types.STRING,
};

export const SESSION_SHAPE = {
	...REQUIRED_SESSION_SHAPE,
	email: Types.STRING,
	emailConfirmed: Types.STRING,
};

export const COOKIE_RENAME_MAP = {
	user_id: 'id',
	session_id: 'sessionId',
	email_confirmed: 'emailConfirmed',
	picture_hash: 'pictureHash',
	account_type: 'accountType',
};

export const SESSION_RENAME_MAP = {
	...COOKIE_RENAME_MAP,
	login_id: 'login',
};

export const SESSION_KEY = 'HI_SESSION';
