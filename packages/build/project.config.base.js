require('dotenv').config();
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development'; // 'development' or 'production'. 'development' by default
const ENV = process.env.ENV || 'testask'; // 'testask', 'qatask' or 'production'. 'testask' by default
const BUILD_TIMESTAMP = new Date().toISOString();
const basePath = path.join(__dirname, '../../');
const mockAPIConfig = require('./api.conf.mock.json');

const config = {
	// ----------------------------------
	// Env variables
	// ----------------------------------
	ENV,
	NODE_ENV,
	DEV: NODE_ENV === 'development',
	PROD: NODE_ENV === 'production',
	USE_MOCK_API: !!process.env.USE_MOCK_API,
	ENABLE_LOCALES: false,
	PUBLISH: process.env.PUBLISH === 'true',
	BUILD_TIMESTAMP,

	// ----------------------------------
	// Server config
	// ----------------------------------
	mockAPIServer: {
		port: mockAPIConfig.API_BASE_PORT,
	},

	// ----------------------------------
	// Project Structure
	// ----------------------------------
	pathBase: basePath,
	pathBuild: path.join(basePath, 'packages/build'),
	pathLocales: path.join(basePath, 'packages/locales'),
	pathMockAPI: path.join(basePath, 'packages/mock-api'),
	pathResources: path.join(basePath, 'packages/resources'),
	pathUtils: path.join(basePath, 'packages/utils'),

	// ----------------------------------
	// Compiler Configuration
	// ----------------------------------
	devMiddlewareConfig: {
		stats: 'errors-only',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	},
	webpackHotEntry: 'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true',
	hotMiddlewareConfig: {
		path: '/__webpack_hmr',
	},
	translationKeyPrefix: '__T',
	uglifyJsConfig: {
		sourceMap: true,
		parallel: true,
		cache: true,
		uglifyOptions: {
			output: {
				beautify: false,
			},
		},
	},
	enableCSSModules: true,

	enableBundleAnalyzer: !!process.env.BUNDLE_ANALYZER,
	enableRenderLogging: !!process.env.LOG_RENDER,
	enablePerfAnalyzer: !!process.env.PERF_ANALYZER,
};

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
	__DEV__: config.DEV,
	__PROD__: config.PROD,
	__ENV__: JSON.stringify(config.ENV),
	__LOG_RENDER__: config.enableRenderLogging,
	__PERF_ANALYZER__: config.enablePerfAnalyzer,
	__ENABLE_LOCALES__: config.ENABLE_LOCALES,
	__BUILD_TIMESTAMP__: JSON.stringify(config.BUILD_TIMESTAMP),
	'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
};

// ------------------------------------
// Utilities
// ------------------------------------
config.paths = {
	base: (...args) => Reflect.apply(path.resolve, null, [config.pathBase, ...args]),
	build: (...args) => Reflect.apply(path.resolve, null, [config.pathBuild, ...args]),
	locales: (...args) => Reflect.apply(path.resolve, null, [config.pathLocales, ...args]),
	mockAPI: (...args) => Reflect.apply(path.resolve, null, [config.pathMockAPI, ...args]),
	resources: (...args) => Reflect.apply(path.resolve, null, [config.pathResources, ...args]),
	utils: (...args) => Reflect.apply(path.resolve, null, [config.pathUtils, ...args]),
};

module.exports = config;
