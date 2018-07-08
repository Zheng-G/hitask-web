const { babel } = require('../../package.json');

const applyAssetsConfig = (webpackConfig, projectConfig) => {
	const { DEV } = projectConfig;
	const { port: DEV_PORT } = projectConfig.devServer;

	// ------------------------------------
	// Images
	// ------------------------------------
	webpackConfig.module.rules.push({
		test: /\.(png|jpg|gif)$/,
		loader: 'url-loader',
		options: {
			limit: 8192,
		},
	});

	webpackConfig.module.rules.push({
		test: /\.svg$/,
		exclude: /node_modules/,
		use: [
			{
				loader: 'babel-loader',
				options: {
					...babel,
					cacheDirectory: true,
				},
			},
			{
				loader: 'react-svg-loader',
				options: {
					jsx: true,
					cacheDirectory: true,
					svgo: {
						floatPrecision: 2,
					},
				},
			},
		],
	});

	// ------------------------------------
	// Fonts
	// ------------------------------------
	const FONT_TYPES = {
		woff: 'application/font-woff',
		woff2: 'application/font-woff2',
		otf: 'font/opentype',
		ttf: 'application/octet-stream',
		eot: 'application/vnd.ms-fontobject',
	};

	Object.keys(FONT_TYPES).forEach(extension => {
		const mimetype = FONT_TYPES[extension];
		webpackConfig.module.rules.push({
			test: new RegExp(`\\.${extension}$`),
			loader: 'url-loader',
			options: {
				name: 'fonts/[name].[ext]',
				publicPath: DEV ? `http://localhost:${DEV_PORT}/` : '/',
				limit: 10000,
				mimetype,
			},
		});
	});

	return webpackConfig;
};

module.exports = applyAssetsConfig;
