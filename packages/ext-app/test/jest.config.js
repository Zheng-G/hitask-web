const fs = require('fs');
const { Accounts, Viewport, timeout } = require('@hitask/test/end-to-end/constants');
const { paths, staticServer } = require('@hitask/ext-build/config/project.config');

const testLocales = fs
	.readdirSync(paths.public('locales'))
	.map(filename => filename.replace('.json', ''));
const localesHash = testLocales.reduce((acc, locale) => {
	acc[locale] = require(paths.public(`locales/${locale}.json`)); // eslint-disable-line import/no-dynamic-require, global-require
	return acc;
}, {});

const usedTranslationKeysHash = require(paths.locales('dist/ext-app-used-keys.json')); // eslint-disable-line import/no-dynamic-require
const usedTranslationKeys = Object.keys(usedTranslationKeysHash).reduce((acc, key) => {
	acc.push(key);
	return acc;
}, []);

const jestConfig = {
	verbose: true,
	rootDir: paths.base(),
	modulePathIgnorePatterns: ['node_modules', '.yarn', 'dist', 'coverage', 'docs'],
	globalSetup: '<rootDir>/packages/test/end-to-end/setup.puppeteer.js',
	globalTeardown: '<rootDir>/packages/test/end-to-end/teardown.puppeteer.js',
	testEnvironment: '<rootDir>/packages/test/end-to-end/puppeteer.env.js',
	testMatch: [
		'<rootDir>/packages/test/end-to-end/shared-tests/**/?(*.)test.web.js',
		'<rootDir>/packages/test/end-to-end/shared-tests/**/?(*.)test.js',
		'<rootDir>/packages/ext-app/test/**/?(*.)test.js',
	],
	globals: {
		isDebug: !!process.env.DEBUG,
		URL: `http://localhost:${staticServer.port}/popup.html`,
		Accounts,
		Viewport,
		timeout,
		localesHash,
		usedTranslationKeys,
	},
};

module.exports = jestConfig;
