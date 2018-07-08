const shell = require('shelljs');
const debug = require('debug')('catalog');
const { paths } = require('./config/project.config');

const checkShellError = message => {
	const error = shell.error();
	if (error) {
		debug(message, error);
		process.exit(1);
	}
};

exports.cleanUp = () => {
	shell.rm('-rf', `${paths.dist()}/*`);
	shell.mkdir('-p', paths.dist());
	debug('- Public folder cleared');
};

const moveLocaleFile = locale => {
	const dist = `${paths.public('locales')}`;
	shell.mkdir('-p', dist);
	shell.cp('-R', paths.locales(`dist/${locale}.json`), dist);
	checkShellError('Error with moving locale file');
	debug('- Locale file was copied to public directory');
};

const copySharedFonts = () => {
	const dist = paths.public('fonts');
	shell.mkdir('-p', dist);
	shell.cp('-R', `${paths.resources('fonts')}/*`, dist);
	checkShellError('Error with assets copying.');
};

exports.copyAssets = () => {
	copySharedFonts();
	moveLocaleFile('en');
	shell.cp('-R', `${paths.base('packages/webapp/resources')}/*`, paths.public());
	debug('- Static assets were copied to public directory');
};
