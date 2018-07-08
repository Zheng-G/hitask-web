/* eslint global-require:0 import/no-dynamic-require:0 */
const fs = require('fs');
const shell = require('shelljs');
const debug = require('debug')('webapp:build:task');
const { slackWebappNotification } = require('@hitask/build/utils/slackNotifications');
const projectConfig = require('./config/project.config');

const { ENV, LOCALES_SOURCE, APP_VERSION, NODE_APP_BASE_URL, paths } = projectConfig;

const checkShellError = message => {
	const error = shell.error();
	if (error) {
		debug(message, error);
		process.exit(1);
	}
};

exports.cleanUp = () => {
	shell.rm('-rf', `${paths.dist()}/*`);
	shell.mkdir('-p', paths.dist());
	debug('- Dist folder cleared');
};

const moveLocaleFile = locale => {
	const dist = `${paths.public('locales')}`;
	shell.mkdir('-p', dist);
	shell.cp('-R', paths.locales(`dist/${locale}.json`), dist);
	checkShellError('Error with moving locale file');
	debug('- Locale file was copied to public directory');
};

const copySharedFonts = () => {
	const errorMessage = 'Error with assets copying.';
	const dist = paths.public('fonts');
	shell.mkdir('-p', dist);
	shell.cp('-R', `${paths.resources('fonts')}/*`, dist);
	checkShellError(errorMessage);
};

exports.copyAssets = () => {
	const errorMessage = 'Error with assets copying.';
	const dist = paths.public();
	shell.mkdir('-p', dist);
	shell.cp('-R', `${paths.project('resources')}/*`, dist);
	checkShellError(errorMessage);
	copySharedFonts();
	debug('- Static assets were copied to public directory');

	if (LOCALES_SOURCE === 'internal' || LOCALES_SOURCE === 'local') {
		moveLocaleFile('en');
	}
};

const copyEb = () => {
	shell.cp('-R', paths.project('.ebextensions'), paths.dist());
	shell.cp('-R', paths.project('.elasticbeanstalk'), paths.dist());
	shell.cp(paths.project('.ebignore'), paths.dist());
	checkShellError('Error copying EB config.');
	debug('- Elastic Beanstalk configs copied');
};

const createPackageFile = () => {
	const deps = ['express', 'debug', 'connect-history-api-fallback'];
	const projectPackage = require('../package.json');
	const serverPackage = require('../server/package.json');
	serverPackage.name = serverPackage.name.replace('@hitask/', 'hitask-');
	serverPackage.version = APP_VERSION;
	if (serverPackage.buildId) {
		serverPackage.buildId = serverPackage.buildId.concat(`.${ENV}`);
	}
	serverPackage.dependencies = deps.reduce((acc, depName) => {
		if (projectPackage.dependencies[depName]) {
			acc[depName] = projectPackage.dependencies[depName].replace('^', '');
		} else if (projectPackage.devDependencies[depName]) {
			acc[depName] = projectPackage.devDependencies[depName].replace('^', '');
		} else {
			console.error(`Dependency ${depName} not found in package.json`);
			process.exit(1);
		}
		return acc;
	}, {});
	const packageFileStr = JSON.stringify(serverPackage, null, 4);
	fs.writeFileSync(paths.dist('package.json'), packageFileStr, 'utf8');
	debug('- Package.json file was created');
};

const copyServerApp = () => {
	shell.cp('-R', `${paths.project('server')}/*`, paths.dist());
	checkShellError('Error with server app copying.');
	debug('- Server app was copied to dist directory');
};

exports.copyAppFiles = () => {
	copyServerApp();
	createPackageFile();
	copyEb();
};

exports.sendSlackNotification = () => {
	const stageName = ENV === 'production' ? 'Production' : 'Beta';
	const deployURL = NODE_APP_BASE_URL;
	const deployLabel = deployURL.replace('https://', '').replace('http://', '');
	const body = {
		text: `Webapp ${stageName} was successfully deployed. Version ${APP_VERSION}\nCheck out <${deployURL}|${deployLabel}> for updates`,
	};

	return slackWebappNotification({ body });
};
