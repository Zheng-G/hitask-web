const express = require('express');
const debug = require('debug')('ext:serve');
const { staticServer, paths } = require('./config/project.config');

const app = express();
app.use(express.static(paths.dist()));
app.listen(staticServer.port);
debug(`Open http://localhost:${staticServer.port}/popup.html in your browser`);
