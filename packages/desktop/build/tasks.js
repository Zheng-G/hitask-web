/* eslint global-require:0 import/no-dynamic-require:0 */
const fs = require('fs');
const shell = require('shelljs');
const YAML = require('yamljs');
const debug = require('debug')('desktop:build:task');
const { slackWebappNotification } = require('@hitask/build/utils/slackNotifications');
const projectConfig = require('./config/project.config');
const mainWebpackConfig = require('./config/webpack.config.main');
const publishConfig = require('./config/publish.config');

const {
	DEV,
	ENV,
	APP_VERSION,
	LOCALES_SOURCE,
	PRODUCT_NAME,
	devServer,
	paths,
	MAC_DESKTOP_INSTALL_URL,
	WIN_DESKTOP_INSTALL_URL,
} = projectConfig;

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

	if (LOCALES_SOURCE === 'internal' || LOCALES_SOURCE === 'local') {
		moveLocaleFile('en');
	}
};

const createPackageFile = () => {
	const appPackage = require(paths.project('src/package.json'));
	const name = appPackage.name.replace('@hitask/', 'hitask-');
	appPackage.name = name;
	appPackage.productName = PRODUCT_NAME;
	appPackage.version = APP_VERSION;
	if (appPackage.buildId) {
		appPackage.buildId = appPackage.buildId.concat(`.${ENV}`);
	}
	appPackage.main = `./${mainWebpackConfig.output.filename}`.replace('[name]', 'main');
	appPackage.dependencies = {};
	const packageFileStr = JSON.stringify(appPackage, null, 4);
	fs.writeFileSync(paths.dist('package.json'), packageFileStr, 'utf8');
	debug('- Package.json file was created');
};

const putUpdateParams = () => {
	const file = YAML.stringify(publishConfig.mac);
	fs.writeFileSync(paths.dist('dev-app-update.yml'), file, 'utf8');
};
exports.putUpdateParams = putUpdateParams;

exports.copyAppFiles = () => {
	createPackageFile();
	putUpdateParams();
};

exports.sendSlackNotification = () => {
	const stageName = ENV !== 'production' ? 'Beta' : 'Production';
	const body = {
		text: `Desktop ${stageName} app was successfully deployed. Version ${APP_VERSION}\nInstall the app (<${WIN_DESKTOP_INSTALL_URL}|win installer>, <${MAC_DESKTOP_INSTALL_URL}|mac installer>) or wait for automatic updates, if it's already installed`,
	};

	return slackWebappNotification({ body });
};
