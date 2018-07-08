const path = require('path');
const jsonServer = require('json-server');
const { API_URL_INDEX } = require('@hitask/build/api.conf.mock.json');
const itemsGenerator = require('./items/generator');
const itemHistoryGenerator = require('./items/history');

const server = jsonServer.create();
const middleware = jsonServer.defaults();
const router = name => jsonServer.router(path.join(__dirname, `routes/${name}.json`));
const defaultRes = {
	response_status: 0,
	__mockResponse: true,
};

// Set default middleware (logger, static, cors and no-cache)
server.use(middleware);

// To handle POST, PUT and PATCH you need to use a body-parser
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
	if (
		req.method === 'POST' ||
		req.method === 'PUT' ||
		req.method === 'PATCH' ||
		req.method === 'DELETE'
	) {
		res.jsonp(defaultRes);
	} else {
		// Continue to JSON Server router
		next();
	}
});

// Custom entries
server.get(`/${API_URL_INDEX}/item`, (req, res) => {
	res.jsonp(itemsGenerator());
});

server.get(`/${API_URL_INDEX}/item/history`, (req, res) => {
	res.jsonp(itemHistoryGenerator(req.query));
});

server.get(`/${API_URL_INDEX}/item/read/:guid`, (req, res) => {
	res.jsonp(defaultRes);
});

// Routing
server.use(`/${API_URL_INDEX}/file`, router('file'));
server.use(`/${API_URL_INDEX}/user`, router('user'));
server.use(`/${API_URL_INDEX}/list`, router('list'));
server.use(`/${API_URL_INDEX}`, router('root'));
server.use(jsonServer.router({}));

module.exports = server;
