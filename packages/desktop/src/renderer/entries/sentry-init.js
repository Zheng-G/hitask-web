import Raven from 'raven-js';

// const normalizeExceptionValue = (data, requestPath) => {
// 	if (data.stacktrace && data.stacktrace.frames) {
// 		data.stacktrace.frames = data.stacktrace.frames.map((frame) => {
// 			if (frame.filename) {
// 				frame.filename = frame.filename.replace(requestPath, '');
// 			}
// 			return frame;
// 		});
// 	}
// 	return data;
// };

// const normalizeErrorData = (data) => {
// 	if (!data.exception || !data.culprit) return data; // Possibly not an error
// 	const match = data.culprit.match(/^file:\/\/(.*)(\/|\\)(.*)$/);
// 	if (!match) return data;
// 	const rootPath = match[1] + match[2];
// 	const requestPath = `file://${rootPath}`;
// 	const fileName = match[3];
// 	data.culprit = fileName; // Normalize culprit
// 	if (data.request && data.request.url) { // Normalize request.url
// 		data.request.url = data.request.url.replace(requestPath, '');
// 	}
// 	if (data.exception.values && data.exception.values[0]) { // Normalize exception.values
// 		data.exception.values = data.exception.values.map(value => normalizeExceptionValue(value, requestPath));
// 	}
// 	return data;
// };

Raven.config(__SENTRY_PUBLIC_DSN__, {
	release: __APP_VERSION__,
	environment: __ENV__,
	// dataCallback: normalizeErrorData,
}).install();

window.addEventListener('unhandledrejection', event => {
	Raven.captureException(event.reason);
});

window.Raven = Raven;
