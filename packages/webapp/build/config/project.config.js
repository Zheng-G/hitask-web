/* eslint import/no-dynamic-require:0 */
require('dotenv').config();
const path = require('path');
const baseConfig = require('@hitask/build/project.config.base');
const baseEnvConfig = require('./conf.base.json');

const { DEV, ENV, USE_MOCK_API } = baseConfig;

const basePath = path.join(__dirname, '../../../../');
const projectPath = path.join(basePath, 'packages/webapp');
const distPath = path.join(basePath, `dist/webapp-${DEV ? 'dev' : ENV}`);
const publicPath = path.join(distPath, 'public');
const { version: appVersion } = require(path.join(projectPath, 'package.json'));
const { buildId } = require(path.join(projectPath, 'server/package.json'));

const stageConfig = require(`./conf.${ENV}.json`);
const apiEnv = USE_MOCK_API ? 'mock' : stageConfig.API_SOURCE;
const apiConfig = require(`@hitask/build/api.conf.${apiEnv}.json`);
const envConfig = {
	...baseEnvConfig,
	...stageConfig,
	...apiConfig,
};

const config = {
	...baseConfig,

	// ----------------------------------
	// Env variables
	// ----------------------------------
	APP_VERSION: appVersion,
	BUILD_ID: buildId,
	TARGET: 'webapp',
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
};

// ----------------------------------
// Compiler Configuration
// ----------------------------------
config.devMiddlewareConfig = {
	...baseConfig.devMiddlewareConfig,
	publicPath: '/',
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
