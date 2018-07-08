/* eslint import/no-dynamic-require:0 */
require('dotenv').config();
const path = require('path');
const baseConfig = require('@hitask/build/project.config.base');
const { loadSecretEnvGlobal } = require('@hitask/build/utils/helpers');
const baseEnvConfig = require('./conf.base.json');

const TARGET = process.env.TARGET || ''; // 'ext-app' or 'ext-calendar'
if (!TARGET) {
	console.error(new Error('TARGET param is not specified'));
	process.exit(1);
}
const { DEV, ENV, USE_MOCK_API, PUBLISH } = baseConfig;

const basePath = path.join(__dirname, '../../../');
const projectPath = path.join(basePath, `./packages/${TARGET}`);
const distPath = path.join(basePath, `./dist/${TARGET}-${DEV ? 'dev' : ENV}`);
const publicPath = distPath;
const { version: appVersion, buildId } = require(path.join(projectPath, './package.json'));

const stageConfig = require(`./conf.${ENV}.json`);
stageConfig.GA_TRACK_ID =
	TARGET === 'ext-calendar' ? stageConfig.GA_TRACK_ID_CALENDAR : stageConfig.GA_TRACK_ID_APP;
const apiEnv = USE_MOCK_API ? 'mock' : stageConfig.API_SOURCE;
const apiConfig = require(`@hitask/build/api.conf.${apiEnv}.json`);
let envConfig = {
	...baseEnvConfig,
	...stageConfig,
	...apiConfig,
};
envConfig.BUGSNAG_API_KEY =
	TARGET === 'ext-calendar' ? envConfig.BUGSNAG_API_KEY_CALENDAR : envConfig.BUGSNAG_API_KEY_APP;
const SECRET_GLOBALS = [
	{
		name: 'CHROME_STORE_SECRET',
		errorMsg: 'Extension can not be uploaded',
		strict: PUBLISH,
	},
];
envConfig = SECRET_GLOBALS.reduce(loadSecretEnvGlobal, envConfig);

const config = {
	...baseConfig,

	// ----------------------------------
	// Env variables
	// ----------------------------------
	TARGET,
	APP_VERSION: appVersion,
	BUILD_ID: buildId,
	IN_DEV_TAB: !!process.env.IN_DEV_TAB,
	...envConfig,

	// ----------------------------------
	// Server config
	// ----------------------------------
	devServer: {
		port: 3001,
	},

	remoteReduxDevtools: {
		port: 3002,
	},

	staticServer: {
		port: 3000,
	},

	// ----------------------------------
	// Project Structure
	// ----------------------------------
	path_project: projectPath,
	path_dist: distPath,
	path_public: publicPath,
};

// ----------------------------------
// Compiler Configuration
// ----------------------------------
config.devMiddlewareConfig = {
	...baseConfig.devMiddlewareConfig,
	publicPath: `http://localhost:${config.devServer.port}`,
};

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
	...baseConfig.globals,
	__APP_VERSION__: JSON.stringify(config.APP_VERSION),
	__BUILD_ID__: JSON.stringify(config.BUILD_ID),
	__TARGET__: JSON.stringify(config.TARGET),
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
};

module.exports = config;
