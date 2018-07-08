/* eslint import/no-dynamic-require:0 */
require('dotenv').config();
const path = require('path');
const baseConfig = require('@hitask/build/project.config.base');
const { loadSecretEnvGlobal } = require('@hitask/build/utils/helpers');
const publishConfig = require('./publish.config');
const baseEnvConfig = require('./conf.base.json');

const { DEV, ENV, USE_MOCK_API, PUBLISH } = baseConfig;

const basePath = path.join(__dirname, '../../../../');
const projectPath = path.join(basePath, 'packages/desktop');
const distPath = path.join(basePath, `dist/desktop-${DEV ? 'dev' : ENV}`);
const publicPath = distPath;
const outputsPath = path.join(basePath, `dist/desktop-${ENV}-outputs`);
const { version: appVersion } = require(path.join(projectPath, 'package.json'));
const { buildId } = require(path.join(projectPath, 'src/package.json'));

const stageConfig = require(`./conf.${ENV}.json`);
const apiEnv = USE_MOCK_API ? 'mock' : stageConfig.API_SOURCE;
const apiConfig = require(`@hitask/build/api.conf.${apiEnv}.json`);
let envConfig = {
	...baseEnvConfig,
	...stageConfig,
	...apiConfig,
};

const SECRET_GLOBALS = [
	{
		name:
			ENV === 'production' ? 'GAUTH_CLIENT_SECRET_PRODUCTION' : 'GAUTH_CLIENT_SECRET_TESTASK',
		targetName: 'GAUTH_CLIENT_SECRET',
		errorMsg: 'Google OAuth will not work',
		strict: PUBLISH,
	},
	{
		name: 'SENTRY_PRIVATE_DSN',
		errorMsg: 'Sentry bug reporting will not work',
		strict: PUBLISH,
	},
	{
		name: 'SENTRY_API_TOKEN',
		errorMsg: 'Sentry sourcemap uploading will not work',
		strict: PUBLISH,
	},
];
envConfig = SECRET_GLOBALS.reduce(loadSecretEnvGlobal, envConfig);

const FileName = {
	mac: ENV !== 'production' ? 'Hitask-Test.dmg' : 'Hitask.dmg',
	win: ENV !== 'production' ? 'Hitask-Test.exe' : 'Hitask.exe',
};
const InstallURL = {
	mac: `https://cdn.hitask.com/${publishConfig.mac.path}/${FileName.mac}`,
	win: `https://cdn.hitask.com/${publishConfig.win.path}/${FileName.win}`,
};

const config = {
	...baseConfig,

	// ----------------------------------
	// Env variables
	// ----------------------------------
	APP_VERSION: appVersion,
	BUILD_ID: buildId,
	TARGET: 'desktop',
	DEBUG_PROD: !!process.env.DEBUG_PROD,
	MAC_DESKTOP_INSTALL_URL: InstallURL.mac,
	WIN_DESKTOP_INSTALL_URL: InstallURL.win,
	...envConfig,

	// ----------------------------------
	// Server config
	// ----------------------------------
	devServer: {
		port: 3000,
	},

	// ----------------------------------
	// Project Structure
	// ----------------------------------
	path_project: projectPath,
	path_dist: distPath,
	path_public: publicPath,
	path_outputs: outputsPath,
};

config.webpackPublicPath = DEV ? `http://localhost:${config.devServer.port}/` : '';
config.webpackHotEntry = `webpack-dev-server/client?http://localhost:${config.devServer.port}/`;

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
	...baseConfig.globals,
	__APP_VERSION__: JSON.stringify(config.APP_VERSION),
	__BUILD_ID__: JSON.stringify(config.BUILD_ID),
	__TARGET__: JSON.stringify(config.TARGET),
	__DEBUG_PROD__: config.DEBUG_PROD,

	// Add envConfig globals
	...Object.keys(envConfig).reduce((acc, key) => {
		const value = envConfig[key];
		acc[`__${key}__`] = typeof value === 'string' ? JSON.stringify(value) : value;
		return acc;
	}, {}),
};

// ------------------------------------
// Utilities
// ------------------------------------
config.paths = {
	...baseConfig.paths,
	project: (...args) => Reflect.apply(path.resolve, null, [config.path_project, ...args]),
	dist: (...args) => Reflect.apply(path.resolve, null, [config.path_dist, ...args]),
	public: (...args) => Reflect.apply(path.resolve, null, [config.path_public, ...args]),
	outputs: (...args) => Reflect.apply(path.resolve, null, [config.path_outputs, ...args]),
};

// ----------------------------------
// Compiler Configuration
// ----------------------------------
config.devMiddlewareConfig = {
	...baseConfig.devMiddlewareConfig,
	publicPath: config.webpackPublicPath,
	contentBase: config.paths.public(),
	hot: true,
};

module.exports = config;
