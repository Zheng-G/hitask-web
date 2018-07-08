/**
 * AJAX requests utility
 */
import qs from 'qs';
import axios from 'axios';
import { I18n } from 'react-redux-i18n';
import { ResponseStatus, ResponseCode } from '@hitask/constants/server';

export const init = (store, onUnAuthCb) => {
	axios.interceptors.request.use(config => {
		const { auth: { session } } = store.getState();
		config.params = config.params || {};
		if (session) {
			config.params.session_id = session.sessionId || '';
		}
		return config;
	});

	axios.interceptors.response.use(
		res => res,
		err => {
			const status = err.response && err.response.status;
			const { auth: { session } } = store.getState();
			if (status === ResponseStatus.NOT_AUTH && onUnAuthCb && session) {
				onUnAuthCb();
			}
			return Promise.reject(err);
		}
	);
};

export default function request({
	url,
	method = 'get',
	params = {},
	headers = {},
	body = {},
	type = 'application/json',
	stringify = true,
	timeout = 20000,
}) {
	if (!url) return Promise.reject(new Error('Request URL is undefined'));
	const urlParams = {
		api_key: __API_KEY__,
		...params,
	};
	const reqHeaders = {
		Accept: 'application/json',
		'Content-Type': type,
		...headers,
	};
	const apiUrl = `${__API_BASE_URL__}/${__API_URL_INDEX__}/${url}`;
	const formattedBody = stringify
		? Object.keys(body).reduce((acc, key) => {
				acc[key] = typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key];
				return acc;
		  }, {})
		: body;
	return axios({
		method,
		url: apiUrl,
		data: stringify ? qs.stringify(formattedBody) : formattedBody,
		params: urlParams,
		headers: reqHeaders,
		timeout,
	});
}

export const getStatic = ({ url }) =>
	axios({
		method: 'get',
		url,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	})
		.then(res => res.data)
		.catch(err => {
			throw err;
		});

const MuteErrorStatusList = [ResponseStatus.NOT_AUTH];
// const WhiteListGetRequests

// Format error to save in store
export const formatHttpError = (payloadError, custom = {}) => {
	if (!payloadError) return payloadError;
	if (
		payloadError.config.method === 'get' &&
		!payloadError.config.url.match(/\/user\/authenticate/)
	)
		return null; // Mute GET requests, except auth
	const error = {
		name: custom.name ? I18n.t(custom.name) : 'Server request error', // TODO: localize
		message: custom.message ? I18n.t(custom.message) : payloadError.message,
	};
	const response = payloadError.response;
	if (response) {
		if (MuteErrorStatusList.indexOf(response.status) !== -1) {
			return null;
		}
		error.response = {
			status: response.status,
			statusText: response.statusText,
		};
		if (response.data) {
			error.response.errorMessage = custom.resMessage
				? I18n.t(custom.resMessage)
				: response.data.error_message;
			error.response.responseStatus = response.data.response_status;
		}
		if (custom[response.status]) {
			const { resMessage } = custom[response.status];
			error.response.errorMessage = I18n.t(resMessage) || error.response.errorMessage;
		}
	} else if (payloadError.message === 'Network Error') {
		error.name = I18n.t(__T('js.errors.network_error'));
		error.message = 'Network error has occurred. Please, check your Internet connection'; // TODO: localize
	} else if (payloadError.code === ResponseCode.TIMEOUT) {
		error.name = I18n.t(__T('js.errors.network_error'));
		error.message = 'Network timeout exceeded. Please, try again later'; // TODO: localize
	}
	return error;
};
