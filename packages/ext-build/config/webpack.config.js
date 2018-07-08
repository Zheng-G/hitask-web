const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTranslationKeysPlugin = require('webpack-extract-translation-keys-plugin');
const { BugsnagDeployPlugin, BugsnagSourceMapPlugin } = require('webpack-bugsnag-plugin');
const baseConfig = require('@hitask/build/webpack.config.base');
const applyStylesConfig = require('@hitask/build/webpack.config.styles');
const applyAssetsConfig = require('@hitask/build/webpack.config.assets');
const projectConfig = require('./project.config');

const {
	DEV,
	PROD,
	TARGET,
	ENV,
	APP_VERSION,
	GA_ENABLED,
	USE_MOCK_API,
	BUGSNAG_API_KEY,
	PUBLISH,
	paths,
	translationKeyPrefix,
} = projectConfig;
const { port: devServerPort } = projectConfig.devServer;
const { port: devtoolsPort } = projectConfig.remoteReduxDevtools;

const commonEntry = ['babel-polyfill']
	.concat(
		DEV
			? [
					'react-hot-loader/patch',
					paths.project('src/entries/customPublicPath'),
					projectConfig.webpackHotEntry,
			  ]
			: [
					paths.project('src/entries/customPublicPath'),
					paths.project('src/entries/bugsnag-init'),
			  ]
	)
	.concat(PROD && GA_ENABLED && !USE_MOCK_API ? [paths.project('src/entries/ga-init')] : []);

const webpackConfig = merge.smart(baseConfig, {
	entry: {
		app: [...commonEntry, paths.project('src/entries/popup')],
		options: [...commonEntry, paths.project('src/entries/options')],
		background: [...commonEntry, paths.project('src/entries/background')],
	},

	output: {
		path: paths.dist(),
		filename: '[name].bundle.js',
		chunkFilename: '[name].chunk.js',
	},

	target: 'web',

	plugins: [
		new webpack.DefinePlugin({
			...projectConfig.globals,
		}),

		// Collect used translation keys
		new ExtractTranslationKeysPlugin({
			functionName: translationKeyPrefix,
			output: paths.locales(`dist/${TARGET}-used-keys.json`),
		}),
	]
		.concat(
			DEV
				? [
						new webpack.DefinePlugin({
							__HOST__: JSON.stringify('localhost'),
							__PORT__: devServerPort,
							__DEVTOOLS_HOST__: JSON.stringify('localhost'),
							__DEVTOOLS_PORT__: devtoolsPort,
						}),
				  ]
				: []
		)

		// Optimizations
		.concat(PROD ? [new UglifyJsPlugin(projectConfig.uglifyJsConfig)] : [])

		// Bugsnag integration
		.concat(
			PROD && PUBLISH
				? [
						new BugsnagSourceMapPlugin({
							apiKey: BUGSNAG_API_KEY,
							publicPath: '*/',
							appVersion: APP_VERSION,
							overwrite: true,
						}),
						new BugsnagDeployPlugin({
							apiKey: BUGSNAG_API_KEY,
							releaseStage: ENV,
							provider: 'gitlab-onpremise',
							appVersion: APP_VERSION,
						}),
				  ]
				: []
		),
});

if (DEV) {
	webpackConfig.devMiddleware = projectConfig.devMiddlewareConfig;
	webpackConfig.hotMiddleware = projectConfig.hotMiddlewareConfig;
}

const webpackFinalConfig = applyAssetsConfig(
	applyStylesConfig(webpackConfig, projectConfig),
	projectConfig
);

module.exports = [webpackFinalConfig];
