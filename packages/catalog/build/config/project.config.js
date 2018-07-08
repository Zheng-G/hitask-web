const path = require('path');
const webappProjectConfig = require('@hitask/webapp/build/config/project.config');

const basePath = path.join(__dirname, '../../../../');

const config = {
	...webappProjectConfig,

	path_project: path.join(basePath, 'packages/catalog'),
	path_dist: path.join(basePath, 'dist/catalog'),
	path_public: path.join(basePath, 'dist/catalog'),
};

config.paths = {
	...config.paths,
	project: (...args) => Reflect.apply(path.resolve, null, [config.path_project, ...args]),
	dist: (...args) => Reflect.apply(path.resolve, null, [config.path_dist, ...args]),
	public: (...args) => Reflect.apply(path.resolve, null, [config.path_public, ...args]),
};

module.exports = config;
