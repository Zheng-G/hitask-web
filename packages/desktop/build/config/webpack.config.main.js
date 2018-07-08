/**
 * Webpack config for production electron main process
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
// const SentryWebpackPlugin = require('webpack-sentry-plugin');
const baseConfig = require('@hitask/build/webpack.config.base');
const projectConfig = require('./project.config');

const { DEV, paths } = projectConfig;

const webpackConfig = merge.smart(baseConfig, {
	entry: {
		main: ['babel-polyfill', paths.project('src/main/main')],
	},

	output: {
		path: paths.dist(),
		filename: DEV ? '[name].js' : '[name].bundle.js',
	},

	target: 'electron-main',

	plugins: [
		new webpack.DefinePlugin({
			...projectConfig.globals,
		}),
	],

	// Sentry integration
	// TODO: fix sourcemaps uploading
	// .concat(PROD ? [
	// 	new SentryWebpackPlugin({
	// 		organization: 'aleksey-xw',
	// 		project: 'hitask-electron',
	// 		apiKey: '537997b844164236abed365a25a1531e7645b14f6e1747c7b624f2786eb6fe30',
	// 		release: APP_VERSION,
	// 		suppressConflictError: true,
	// 		filenameTransform: filename => filename,
	// 	}),
	// ] : []),

	/**
	 * Disables webpack processing of __dirname and __filename.
	 * If you run the bundle in node.js it falls back to these values of node.js.
	 * https://github.com/webpack/webpack/issues/2010
	 */
	node: {
		__dirname: false,
		__filename: false,
	},

	optimization: {
		splitChunks: false, // Disable code splitting
	},
});

module.exports = webpackConfig;
