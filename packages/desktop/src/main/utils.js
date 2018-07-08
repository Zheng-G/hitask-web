/* eslint import/prefer-default-export:0 */
import path from 'path';
import { Platforms } from './constants/globals';
import Raven from './raven';

const correctAbsolutePath = Raven.wrap(pathStr => {
	if (!pathStr) return pathStr;
	if (process.platform === Platforms.WIN) {
		if (pathStr[0] === '\\' || pathStr[0] === '/') return pathStr.substr(1);
	}
	return pathStr;
});

const correctRelativePath = Raven.wrap(pathStr => {
	if (!pathStr) return pathStr;
	const resultPath = pathStr.replace(/^[/\\]/, '');
	if (process.platform === Platforms.WIN) {
		const withoutNamespace = resultPath.replace(/^\w:[/\\]/, '');
		return withoutNamespace;
	}
	return resultPath;
});

const isAbsolutePath = Raven.wrap(pathStr => {
	if (!pathStr) return pathStr;
	const targetPath = path.normalize(pathStr);
	const rootPrefix = __dirname.substr(0, 8);
	let isRoot = false;
	if (
		process.platform === Platforms.WIN &&
		targetPath[0] === '\\' &&
		targetPath.indexOf(rootPrefix) === 1
	) {
		isRoot = true;
	} else if (targetPath.indexOf(rootPrefix) === 0) {
		isRoot = true;
	}
	return isRoot;
});

export const convertAbsolutePath = Raven.wrap(pathStr => {
	if (!pathStr) return pathStr;

	let clearPath = pathStr;
	if (pathStr.includes('?')) {
		clearPath = pathStr.match(/^(.*)\?/)[1];
	}
	if (pathStr.includes('#')) {
		clearPath = clearPath.match(/^(.*)#/)[1];
	}

	if (isAbsolutePath(clearPath)) {
		return correctAbsolutePath(clearPath);
	}

	const normalizedPath = path.normalize(`${__dirname}/${correctRelativePath(clearPath)}`);
	const absolutePath = correctAbsolutePath(normalizedPath);
	return absolutePath;
});
