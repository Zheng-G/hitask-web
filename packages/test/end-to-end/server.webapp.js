const { devServer, paths } = require('@hitask/webapp/build/config/project.config');

const app = require(paths.dist('server')); // eslint-disable-line import/no-dynamic-require
const server = app.listen(devServer.port);

module.exports = server;
