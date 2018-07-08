const express = require('express');
const { staticServer, paths } = require('@hitask/ext-build/config/project.config');

const app = express();
app.use(express.static(paths.dist()));
const server = app.listen(staticServer.port);

module.exports = server;
