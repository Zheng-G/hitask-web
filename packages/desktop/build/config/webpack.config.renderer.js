/**
 * Build config for electron renderer process
 */
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTranslationKeysPlugin = require('webpack-extract-translation-keys-plugin');
const SentryWebpackPlugin = require('webpack-sentry-plugin');
const projectConfig = require('./project.config');
const baseConfig = require('@hitask/build/webpack.config.base');
const applyStylesConfig = require('@hitask/build/webpack.config.styles');
const applyAssetsConfig = require('@hitask/build/webpack.config.assets');

const {
	DEV,
	PROD,
	GA_ENABLED,
	USE_MOCK_API,
	APP_VERSION,
	SENTRY_API_TOKEN,
	PUBLISH,
	INTERCOM_ENABLED,
	paths,
	translationKeyPrefix,
} = projectConfig;
const commonEntry = ['babel-polyfill']
	.concat(
		DEV
			? [
					'react-hot-loader/patch',
					projectConfig.webpackHotEntry,
					'webpack/hot/only-dev-server',
			  ]
			: [paths.project('src/renderer/entries/sentry-init')]
	)
	.concat(
		PROD && GA_ENABLED && !USE_MOCK_API ? [paths.project('src/renderer/entries/ga-init')] : []
	)
	.concat(
		PROD && !USE_MOCK_API && INTERCOM_ENABLED
			? [paths.build('sharedEntries/intercom-init')]
			: []
	)
	.concat([paths.project('src/renderer/entries/ipc')]);

const webpackConfig = merge.smart(baseConfig, {
	entry: {
		renderer: [...commonEntry, paths.project('src/renderer/entries/app')],
	},

	output: {
		filename: '[name].bundle.js',
		path: paths.public(),
		chunkFilename: '[name].chunk.js',
		publicPath: projectConfig.webpackPublicPath,
	},

	target: 'electron-renderer',

	plugins: [
		new webpack.DefinePlugin({
			...projectConfig.globals,
		}),

		// Collect used translation keys
		new ExtractTranslationKeysPlugin({
			functionName: translationKeyPrefix,
			output: paths.locales('dist/desktop-used-keys.json'),
		}),
	]

		// Optimizations
		.concat(PROD ? [new UglifyJsPlugin(projectConfig.uglifyJsConfig)] : [])

		// Sentry integration
		.concat(
			PROD && PUBLISH
				? [
						new SentryWebpackPlugin({
							organization: 'hitask',
							project: 'hitask-desktop',
							apiKey: SENTRY_API_TOKEN,
							release: APP_VERSION,
							suppressConflictError: true,
							filenameTransform: filename => filename,
						}),
				  ]
				: []
		),

	/**
	 * Disables webpack processing of __dirname and __filename.
	 * If you run the bundle in node.js it falls back to these values of node.js.
	 * https://github.com/webpack/webpack/issues/2010
	 */
	node: {
		__dirname: false,
		__filename: false,
	},
});

const webpackFinalConfig = applyAssetsConfig(
	applyStylesConfig(webpackConfig, projectConfig),
	projectConfig
);

module.exports = webpackFinalConfig;
