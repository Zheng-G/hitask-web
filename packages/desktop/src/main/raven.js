import os from 'os';
import Raven from 'raven';

Raven.config(__PROD__ ? __SENTRY_PRIVATE_DSN__ : null, {
	captureUnhandledRejections: true,
	release: __APP_VERSION__,
	environment: __ENV__,
	tags: {
		process: process.type,
		electron: process.versions.electron,
		chrome: process.versions.chrome,
		platform: os.platform(),
		platform_release: os.release(),
	},
}).install();

export default Raven;
