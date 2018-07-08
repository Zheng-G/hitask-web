/* eslint no-console:0 */

export const logObject = (obj, label = '') =>
	console.log(`${label} `, JSON.stringify(obj, null, 2));

export const logRender = msg => {
	if (__DEV__ && __LOG_RENDER__) {
		console.log(msg, new Date().getTime());
	}
};

export const notifyBugsnagException = error => {
	if (error && window.Bugsnag) {
		window.Bugsnag.notifyException(error);
	}
};
