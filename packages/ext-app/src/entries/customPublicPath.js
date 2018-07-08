/* global __webpack_public_path__:true */
/* eslint camelcase: 0 */
/* eslint no-unused-vars: 0 */
import { isExtension } from '@hitask/utils/helpers';

if (__PROD__) {
	__webpack_public_path__ = isExtension ? chrome.extension.getURL('/') : '/';
} else {
	// In development mode,
	// the iframe of injectpage cannot get correct path,
	// it need to get parent page protocol.
	const path = `//${__HOST__}:${__PORT__}/`;
	if (
		window.location.protocol === 'https:' ||
		window.location.search.indexOf('protocol=https') !== -1
	) {
		__webpack_public_path__ = `https:${path}`;
	} else {
		__webpack_public_path__ = `http:${path}`;
	}
}
