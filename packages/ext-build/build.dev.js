const express = require('express');
const remotedev = require('remotedev-server');
const createWebpackServer = require('webpack-httpolyglot-server');
const debug = require('debug')('ext:build:dev');
const tasks = require('./tasks');
const {
	TARGET,
	IN_DEV_TAB,
	paths,
	remoteReduxDevtools,
	devServer,
	staticServer,
	USE_MOCK_API,
	mockAPIServer: mockAPIConfig,
} = require('./config/project.config');
const webpackConfig = require('./config/webpack.config.js');

tasks.cleanUp();
tasks.copyAssets();

debug('-'.repeat(80));
debug('[Webpack Dev]');
debug('-'.repeat(80));

if (IN_DEV_TAB) {
	const app = express();
	app.use(express.static(paths.dist()));
	app.listen(staticServer.port);
	debug(`Open http://localhost:${staticServer.port}/popup.html in your browser`);
} else {
	debug(
		`Load unpacked extensions from './${TARGET}-dev' folder. (see https://developer.chrome.com/extensions/getstarted#unpacked)`
	);
	remotedev({
		hostname: 'localhost',
		port: remoteReduxDevtools.port,
	});
}

if (USE_MOCK_API) {
	const mockAPIServer = require('@hitask/mock-api/server'); // eslint-disable-line global-require, import/no-unresolved
	mockAPIServer.listen(mockAPIConfig.port, () => {
		debug(`- Mock API server is now running at http://localhost:${mockAPIConfig.port}.`);
	});
}

createWebpackServer(webpackConfig, {
	host: 'localhost',
	port: devServer.port,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
});
