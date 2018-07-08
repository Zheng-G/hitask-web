const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const ExtractTranslationKeysPlugin = require('webpack-extract-translation-keys-plugin');
const { BugsnagDeployPlugin, BugsnagSourceMapPlugin } = require('webpack-bugsnag-plugin');
const baseConfig = require('@hitask/build/webpack.config.base');
const applyStylesConfig = require('@hitask/build/webpack.config.styles');
const applyAssetsConfig = require('@hitask/build/webpack.config.assets');
const projectConfig = require('./project.config');

const {
	DEV,
	PROD,
	ENV,
	APP_VERSION,
	GA_ENABLED,
	USE_MOCK_API,
	BUGSNAG_API_KEY,
	PUBLISH,
	INTERCOM_ENABLED,
	paths,
	translationKeyPrefix,
} = projectConfig;

const commonEntry = ['babel-polyfill']
	.concat(
		DEV
			? ['react-hot-loader/patch', projectConfig.webpackHotEntry]
			: [paths.project('src/entries/bugsnag-init')]
	)
	.concat(PROD && !USE_MOCK_API && GA_ENABLED ? [paths.project('src/entries/ga-init')] : [])
	.concat(
		PROD && !USE_MOCK_API && INTERCOM_ENABLED
			? [paths.build('sharedEntries/intercom-init')]
			: []
	);

const webpackConfig = merge.smart(baseConfig, {
	entry: {
		app: [...commonEntry, paths.project('src/entries/app')],
	},

	output: {
		filename: '[name].bundle.js',
		path: paths.public(),
		chunkFilename: '[name].chunk.js',
		publicPath: '/',
	},

	target: 'web',

	plugins: [
		new webpack.DefinePlugin({
			...projectConfig.globals,
		}),

		// Templates
		new HtmlWebpackPlugin({
			template: paths.project('src/views/index.html'),
			hash: false,
			favicon: false,
			filename: 'index.html',
			inject: 'body',
			minify: {
				collapseWhitespace: true,
			},
		}),

		// Collect used translation keys
		new ExtractTranslationKeysPlugin({
			functionName: translationKeyPrefix,
			output: paths.locales('dist/webapp-used-keys.json'),
		}),
	]

		// Optimizations
		.concat(PROD ? [new UglifyJsPlugin(projectConfig.uglifyJsConfig)] : [])

		// Bugsnag integration
		.concat(
			PROD && PUBLISH
				? [
						new BugsnagSourceMapPlugin({
							apiKey: BUGSNAG_API_KEY,
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

const webpackFinalConfig = applyAssetsConfig(
	applyStylesConfig(webpackConfig, projectConfig),
	projectConfig
);

module.exports = webpackFinalConfig;
