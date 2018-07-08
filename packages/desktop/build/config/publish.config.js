const { ENV } = require('@hitask/build/project.config.base');

const config = {
	mac: {
		provider: 's3',
		bucket: 'hitask-cdn',
		path: `desktop/${ENV}/macos`,
		region: 'us-east-1',
	},
	win: {
		provider: 's3',
		bucket: 'hitask-cdn',
		path: `desktop/${ENV}/windows`,
		region: 'us-east-1',
	},
};

module.exports = config;
