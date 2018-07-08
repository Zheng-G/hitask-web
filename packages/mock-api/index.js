const server = require('./server');
const mockAPIConfig = require('@hitask/build/api.conf.mock.json');

server.listen(mockAPIConfig.API_BASE_PORT, () => {
	console.log(`JSON Server is running at http://localhost:${mockAPIConfig.API_BASE_PORT}`); // eslint-disable-line no-console
});
