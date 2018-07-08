/**
 * @module utils/localStorage
 */

import { LOCAL_STOR_KEY } from '@hitask/constants/storage';

export const getItem = name => {
	if (!window.localStorage) return null;
	const localConfigStr = window.localStorage.getItem(LOCAL_STOR_KEY);
	if (!localConfigStr) return null;
	return JSON.parse(localConfigStr)[name] || null;
};

export const setItem = (name, value) => {
	if (!window.localStorage) return;
	const localConfigStr = window.localStorage.getItem(LOCAL_STOR_KEY);
	const localConfig = localConfigStr ? JSON.parse(localConfigStr) : {};
	localConfig[name] = value;
	window.localStorage.setItem(LOCAL_STOR_KEY, JSON.stringify(localConfig));
};

export const removeItem = name => {
	if (!window.localStorage) return;
	const localConfigStr = window.localStorage.getItem(LOCAL_STOR_KEY);
	if (!localConfigStr) return;
	const localConfig = JSON.parse(localConfigStr);
	delete localConfig[name];
	const nextLocalConfig = JSON.stringify(localConfig);
	if (nextLocalConfig === '{}') {
		window.localStorage.removeItem(LOCAL_STOR_KEY);
	} else {
		window.localStorage.setItem(LOCAL_STOR_KEY, nextLocalConfig);
	}
};

export const clear = () => {
	if (!window.localStorage || !window.localStorage.getItem(LOCAL_STOR_KEY)) return;
	window.localStorage.removeItem(LOCAL_STOR_KEY);
};
