const puppeteer = require('puppeteer');
const fs = require('fs');
const shell = require('shelljs');
const os = require('os');
const path = require('path');
const { Viewport } = require('./constants');

let project;
switch (process.env.TARGET) {
	case 'ext-app':
		project = 'ext-app';
		break;
	case 'ext-calendar':
		project = 'ext-calendar';
		break;
	default:
		project = 'webapp';
}

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
const isDebug = !!process.env.DEBUG;
const isExtension = project === 'ext-app' || project === 'ext-calendar';

module.exports = async () => {
	const server = require(`./server.${isExtension ? 'extension' : project}`); // eslint-disable-line import/no-dynamic-require, global-require
	const browser = isDebug
		? await puppeteer.launch({
				headless: false,
				slowMo: 80,
				args: ['--no-sandbox', `--window-size=${Viewport.width},${Viewport.height}`],
		  })
		: await puppeteer.launch({
				args: ['--no-sandbox'],
		  });
	shell.mkdir('-p', DIR);
	fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());

	global.BROWSER = browser;
	global.SERVER = server;
};
