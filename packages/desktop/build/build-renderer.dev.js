const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const debug = require('debug')('desktop:build-renderer:dev');
const { spawn } = require('child_process');
const {
	ENV,
	devServer,
	devMiddlewareConfig,
	USE_MOCK_API,
	mockAPIServer: mockAPIConfig,
} = require('./config/project.config');
const webpackConfig = require('./config/webpack.config.renderer.js');

const startElectron = () => {
	spawn('npm', ['run', `desktop:${ENV}:dev-main`], {
		shell: true,
		env: process.env,
		stdio: 'inherit',
	})
		.on('close', code => process.exit(code))
		.on('error', error => console.error(error));
};

const compile = () => {
	debug('- Start webpack renderer build');
	const compiler = webpack(webpackConfig);
	const server = new webpackDevServer(compiler, {
		...devMiddlewareConfig,
		after() {
			if (process.env.TRIGGER_MAIN) {
				startElectron();
			}
		},
	});

	const port = devServer.port;
	server.listen(port, '127.0.0.1', () => {
		debug(`- Dev server is now running at http://localhost:${port}`);
		debug('- Wait until compiling is finished...');
	});
};

if (USE_MOCK_API) {
	const mockAPIServer = require('@hitask/mock-api/server'); // eslint-disable-line global-require, import/no-unresolved
	mockAPIServer.listen(mockAPIConfig.port, () => {
		debug(`- Mock API server is now running at http://localhost:${mockAPIConfig.port}.`);
	});
}

compile();
