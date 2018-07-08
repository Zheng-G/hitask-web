const debug = require('debug')('webapp:build:dev');
const tasks = require('./tasks');
const {
	devServer: devServerConfig,
	USE_MOCK_API,
	mockAPIServer: mockAPIConfig,
} = require('./config/project.config');
const devServer = require('../server/server');

tasks.cleanUp();
tasks.copyAssets();

if (USE_MOCK_API) {
	const mockAPIServer = require('@hitask/mock-api/server'); // eslint-disable-line global-require, import/no-unresolved
	mockAPIServer.listen(mockAPIConfig.port, () => {
		debug(`- Mock API server is now running at http://localhost:${mockAPIConfig.port}.`);
	});
}

devServer.listen(devServerConfig.port, () => {
	debug(`- Dev server is now running at http://localhost:${devServerConfig.port}.`);
	debug('- Wait until compiling is finished...');
});
