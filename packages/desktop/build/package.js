const builder = require('electron-builder');
const debug = require('debug')('desktop:package');
const { PUBLISH } = require('./config/project.config');
const config = require('./config/build.config');

const PLATFORM = process.env.PLATFORM;
if (!PLATFORM) {
	console.error(new Error('PLATFORM param is not specified'));
	process.exit(1);
}

const Platform = builder.Platform;
debug(`- Start electron-builder for ${PLATFORM} platform`);
debug(PUBLISH ? `- ${PLATFORM}: Auto-uploading enabled` : `- ${PLATFORM}: Auto-uploading disabled`);
const targets = PLATFORM === 'win' ? Platform.WINDOWS.createTarget() : Platform.MAC.createTarget();

builder
	.build({
		targets,
		config,
		publish: PUBLISH ? 'always' : 'never',
	})
	.then(() => {
		debug(`- ${PLATFORM}: Dist package was built successfully`);
	})
	.catch(error => {
		console.error(error);
	});
