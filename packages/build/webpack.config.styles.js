const cloneDeep = require('lodash/cloneDeep');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const applyStylesConfig = (webpackConfig, projectConfig) => {
	const { DEV, PROD, paths } = projectConfig;

	const BASE_CSS_LOADER = {
		loader: 'css-loader',
		options: {
			sourceMap: true,
			minimize: {
				autoprefixer: {
					add: true,
					remove: true,
					browsers: ['last 2 versions'],
				},
				discardComments: {
					removeAll: true,
				},
				discardUnused: false,
				mergeIdents: false,
				reduceIdents: false,
				safe: true,
			},
		},
	};

	// Add any package names here whose styles need to be treated as CSS modules.
	// These paths will be combined into a single regex.
	const PATHS_TO_TREAT_AS_CSS_MODULES = [];
	const PATHS_NOT_TO_TREAT_AS_CSS_MODULES = [];

	// If config has CSS modules enabled, treat this project's styles as CSS modules.
	if (projectConfig.enableCSSModules) {
		PATHS_TO_TREAT_AS_CSS_MODULES.push(
			paths.base('packages').replace(/[\^$.*+\-?=!:|\\/()[\]{},]/g, '\\$&')
		);
		PATHS_NOT_TO_TREAT_AS_CSS_MODULES.push(
			paths
				.base('packages/styles/src/global.scss')
				.replace(/[\^$.*+\-?=!:|\\/()[\]{},]/g, '\\$&'),
			paths
				.base('node_modules/@hitask/blueprint-core/dist/blueprint.css')
				.replace(/[\^$.*+\-?=!:|\\/()[\]{},]/g, '\\$&')
		);
	}

	const isUsingCSSModules = !!PATHS_TO_TREAT_AS_CSS_MODULES.length;
	const cssModulesRegex = new RegExp(
		`^(?!${PATHS_NOT_TO_TREAT_AS_CSS_MODULES.join('|')})(${PATHS_TO_TREAT_AS_CSS_MODULES.join(
			'|'
		)})`
	);

	// Loaders for styles that need to be treated as CSS modules.
	if (isUsingCSSModules) {
		const cssModulesLoader = cloneDeep(BASE_CSS_LOADER);
		cssModulesLoader.options = Object.assign(cssModulesLoader.options, {
			modules: true,
			importLoader: 1,
			localIdentName: DEV ? '[name]__[local]' : '[hash:base64:6]',
		});

		webpackConfig.module.rules.push({
			test: /\.scss$/,
			include: cssModulesRegex,
			// exclude: /core\.scss/g,
			use: [
				{
					loader: 'style-loader',
				},
				cssModulesLoader,
				{
					loader: 'sass-loader',
					options: {
						sourceMap: true,
						includePaths: [paths.base('packages/styles/src')],
					},
				},
			],
		});

		webpackConfig.module.rules.push({
			test: /\.css$/,
			include: cssModulesRegex,
			use: [
				{
					loader: 'style-loader',
				},
				cssModulesLoader,
			],
		});
	}

	// Loaders for files that should not be treated as CSS modules.
	const excludeCSSModules = isUsingCSSModules ? cssModulesRegex : false;
	webpackConfig.module.rules.push({
		test: /\.scss$/,
		exclude: excludeCSSModules,
		use: [
			{
				loader: 'style-loader',
			},
			BASE_CSS_LOADER,
			{
				loader: 'sass-loader',
				options: {
					sourceMap: true,
					includePaths: [paths.base('packages/styles/src')],
				},
			},
		],
	});
	webpackConfig.module.rules.push({
		test: /\.css$/,
		exclude: excludeCSSModules,
		use: [
			{
				loader: 'style-loader',
			},
			BASE_CSS_LOADER,
		],
	});

	if (PROD) {
		webpackConfig.module.rules.filter(rule => /css\$\/$/.test(rule.test)).forEach(rule => {
			const restLoaders = rule.use.slice(1); // First loader is 'style-loader'
			rule.use = [MiniCssExtractPlugin.loader].concat(restLoaders);
		});

		webpackConfig.plugins.push(
			new MiniCssExtractPlugin({
				filename: '[name].css',
			})
		);
	}

	return webpackConfig;
};

module.exports = applyStylesConfig;
