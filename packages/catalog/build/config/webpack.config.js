// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const webpack = require('webpack');
const { globals, translationKeyPrefix, paths } = require('./project.config');
const webappWebpackConfig = require('@hitask/webapp/build/config/webpack.config');

module.exports = storybookBaseConfig => ({
	...storybookBaseConfig,
	module: {
		...storybookBaseConfig.module,
		rules: webappWebpackConfig.module.rules.concat([
			{
				test: /\.stories\.js?$/,
				loaders: [
					{
						loader: require.resolve('@storybook/addon-storysource/loader'),
						options: { parser: 'typescript' },
					},
				],
				enforce: 'pre',
			},
		]),
	},
	resolve: {
		...storybookBaseConfig.resolve,
		...webappWebpackConfig.resolve,
	},
	plugins: storybookBaseConfig.plugins.concat([
		new webpack.DefinePlugin(globals),
		new webpack.ProvidePlugin({
			[translationKeyPrefix]: paths.build('utils/convertTranslationKey'),
		}),
	]),
});
