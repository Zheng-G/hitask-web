const debug = require('debug')('webapp:server');
const server = require('./server');

const port = process.env.PORT || 3000;
server.listen(port, () => {
	debug(`- Server is now running on port ${port}.`);
});
