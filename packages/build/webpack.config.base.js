const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const {
	DEV,
	PROD,
	paths,
	enableBundleAnalyzer,
	translationKeyPrefix,
} = require('./project.config.base');
const { babel } = require('../../package.json');

const config = {
	mode: PROD ? 'production' : 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					...babel,
					presets: babel.presets
						.map(preset => {
							if (Array.isArray(preset) && preset[0] === 'env') {
								preset[1].modules = false;
							}
							return preset;
						})
						.concat(PROD ? ['react-optimize'] : []),
					plugins: [].concat(DEV ? ['react-hot-loader/babel'] : []).concat(babel.plugins),
					cacheDirectory: true,
				},
			},
		],
	},

	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@hitask/constants': '@hitask/constants/src',
			'@hitask/components': '@hitask/components/src',
			'@hitask/modules': '@hitask/modules/src',
			'@hitask/styles': '@hitask/styles/src',
			'@hitask/utils': '@hitask/utils/src',
			'@hitask/icons': '@hitask/resources/icons',
			'@blueprintjs/core': '@hitask/blueprint-core',
			'@blueprintjs/datetime': '@hitask/blueprint-datetime',
			'@blueprintjs/table': '@hitask/blueprint-table',
			'@blueprintjs/labs': '@hitask/blueprint-labs',
		},
	},

	plugins: [
		new webpack.ContextReplacementPlugin(/moment[/\\]locale/, /en/),
		new webpack.ProvidePlugin({
			[translationKeyPrefix]: paths.build('utils/convertTranslationKey'),
		}),
		// FIXME: some modules are not loaded
		// new LodashModuleReplacementPlugin({
		// 	cloning: true,
		// 	collections: true,
		// 	caching: true,
		// 	exotics: true,
		// 	currying: true,
		// }),
	]
		.concat(
			DEV
				? [
						new WebpackNotifierPlugin(),
						new webpack.HotModuleReplacementPlugin(),
						new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
				  ]
				: [
						new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
						new webpack.ProgressPlugin({ profile: false }),
				  ]
		)
		.concat(enableBundleAnalyzer ? [new BundleAnalyzerPlugin()] : []),

	devtool: DEV ? 'cheap-module-source-map' : 'source-map',

	bail: true,

	optimization: {
		splitChunks: {
			chunks: 'initial',
			cacheGroups: {
				default: false,
				vendors: {
					name: 'vendors',
					test: /[\\/]node_modules[\\/]/,
				},
			},
		},
	},
};

module.exports = config;
