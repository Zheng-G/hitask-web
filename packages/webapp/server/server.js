/* eslint global-require:0 */
const path = require('path');
const express = require('express');
const debug = require('debug')('webapp:server');
const connectHistoryFallback = require('connect-history-api-fallback');

const app = express();

// --------------------------------------
// Configure app
// --------------------------------------
// app.use(express.bodyParser());
// app.use(express.methodOverride());
app.use(connectHistoryFallback());

if (process.env.NODE_ENV === 'development') {
	debug('- Using development settings');

	const webpack = require('webpack');
	const devMiddleware = require('webpack-dev-middleware');
	const hotMiddleware = require('webpack-hot-middleware');
	const projectConfig = require('../build/config/project.config');
	const webpackConfig = require('../build/config/webpack.config');

	const compiler = webpack(webpackConfig);

	// ------------------------------------
	// Apply Webpack HMR Middleware
	// ------------------------------------
	debug('- Enable webpack dev and HMR middleware');
	const middleware = devMiddleware(compiler, projectConfig.devMiddlewareConfig);
	app.use(middleware);
	app.use(hotMiddleware(compiler, projectConfig.hotMiddlewareConfig));

	debug(`- Public path: ${projectConfig.paths.public()}`);
	app.use(express.static(projectConfig.paths.public()));
	app.get(
		'*',
		(req, res, next) => {
			req.url = '/index.html';
			return next();
		},
		middleware
	);
} else {
	// ------------------------------------
	// Configure production settings
	// ------------------------------------
	debug('- Using production settings');

	app.use(express.static(path.join(__dirname, 'public')));
	app.get('*', (req, res) =>
		res.sendFile(path.resolve(path.join(__dirname, 'public/index.html')))
	);
}

module.exports = app;
