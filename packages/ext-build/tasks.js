const shell = require('shelljs');
const _assign = require('lodash/assign');
const debug = require('debug')('ext:build:task');
const fs = require('fs');
const { slackWebappNotification } = require('@hitask/build/utils/slackNotifications');
const projectConfig = require('./config/project.config');
const storeCredentials = require('./config/storeCredentials');

const { DEV, ENV, TARGET, LOCALES_SOURCE, APP_VERSION, PUBLISH, devServer, paths } = projectConfig;
const PACKAGE_NAME = `${TARGET}-${DEV ? 'dev' : ENV}`;
const OUTPUT_DIR = `dist/${PACKAGE_NAME}`;

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
	const dist = paths.public('locales');
	shell.mkdir('-p', dist);
	shell.cp('-R', paths.locales(`dist/${locale}.json`), dist);
	checkShellError('Error with moving locale file');
	debug('- Locale file was copied to public directory');
};

const compileViews = () => {
	const src = paths.project('src/views/');
	const dist = paths.public();
	const { stderr } = shell.exec(
		`pug -O "{ dev: ${DEV}, host: 'localhost', port: '${devServer.port}' }" -o ${dist} ${src}`
	);
	if (stderr) {
		debug('Error with rendering views', stderr);
		process.exit(1);
	}
	debug('- Templates compiled successfully');
};

const createManifest = () => {
	const manifestBase = require(`@hitask/${TARGET}/manifest/manifest.base.js`); // eslint-disable-line import/no-dynamic-require, global-require
	const env = DEV ? 'dev' : ENV;
	const manifestEnv = require(`@hitask/${TARGET}/manifest/manifest.${env}.js`); // eslint-disable-line import/no-dynamic-require, global-require
	const manifest = _assign(manifestBase, manifestEnv);
	manifest.version = APP_VERSION;
	const manifestStr = JSON.stringify(manifest, null, 4);
	fs.writeFileSync(paths.dist('manifest.json'), manifestStr, 'utf8');
	debug('- Manifest file created');
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

	compileViews();
	createManifest();

	if (LOCALES_SOURCE === 'internal' || LOCALES_SOURCE === 'local') {
		moveLocaleFile('en');
	}
};

exports.createArchive = () => {
	const { stderr } = shell.exec(`
		cd dist;
		rm -f ${PACKAGE_NAME}/*.map;
		zip -r ${PACKAGE_NAME}.zip ${PACKAGE_NAME}
	`);
	if (stderr) {
		debug('Error with archive creation.', stderr);
		process.exit(1);
	}
	debug('- Archive file created');
};

exports.uploadAndPublish = () => {
	if (!PUBLISH)
		return Promise.reject(new Error('Are you sure you want to deploy the extension?'));
	debug('- Upload to Chrome webstore');
	const webStore = require('chrome-webstore-upload')(storeCredentials); // eslint-disable-line global-require
	return webStore
		.fetchToken()
		.then(token => {
			debug('Token fetched successfully');
			const myZipFile = fs.createReadStream(`${OUTPUT_DIR}.zip`);
			return webStore
				.uploadExisting(myZipFile, token)
				.then(res => {
					// Response is a Resource Representation
					// https://developer.chrome.com/webstore/webstore_api/items#resource
					debug('Archive uploaded: ', JSON.stringify(res, null, 4));
					return !res.itemError
						? webStore.publish('default', token)
						: Promise.reject(res.itemError);
				})
				.then(res => {
					// Response is documented here:
					// https://developer.chrome.com/webstore/webstore_api/items/publish
					debug('Publishing result: ', JSON.stringify(res, null, 4));
					return res.status && res.status[0] === 'OK' ? res : Promise.reject(res);
				});
		})
		.catch(err => {
			debug('Publishing error: ', err);
			process.exit(1);
		});
};

exports.sendSlackNotification = () => {
	const appName =
		TARGET === 'ext-calendar' ? 'Chrome extension-calendar' : 'Chrome extension-app';
	const stageName = ENV === 'production' ? 'Production' : 'Beta';
	let installUrl = '';
	if (TARGET === 'ext-calendar') {
		installUrl =
			ENV === 'production'
				? 'https://chrome.google.com/webstore/detail/hitask-calendar/klampmflkkkkddabnobekobadggokego'
				: 'https://chrome.google.com/webstore/detail/hitask-calendar-beta/mdfleddhginjkilepiklgdpgjhhflikp';
	} else {
		installUrl =
			ENV === 'production'
				? 'https://chrome.google.com/webstore/detail/hitask-team-task-manageme/nnlnblaalckiclfobnmlpmokohcnblol'
				: 'https://chrome.google.com/webstore/detail/hitask-beta/hdlaolppagcfiibhhdifefmphimaeigm';
	}
	const updateUrl = 'chrome://extensions';
	const body = {
		text: `${stageName} ${appName} was successfully deployed. Version ${APP_VERSION}\n<${installUrl}|Install> or <${updateUrl}|update> to check out new changes`,
	};

	return slackWebappNotification({ body });
};
