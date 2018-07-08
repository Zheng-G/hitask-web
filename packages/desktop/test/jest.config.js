const fs = require('fs');
const { Accounts, timeout } = require('@hitask/test/end-to-end/constants');
const { paths } = require('../build/config/project.config');

const testLocales = fs
	.readdirSync(paths.public('locales'))
	.map(filename => filename.replace('.json', ''));
const localesHash = testLocales.reduce((acc, locale) => {
	acc[locale] = require(paths.public(`locales/${locale}.json`)); // eslint-disable-line import/no-dynamic-require, global-require
	return acc;
}, {});

const usedTranslationKeysHash = require(paths.locales('dist/desktop-used-keys.json')); // eslint-disable-line import/no-dynamic-require
const usedTranslationKeys = Object.keys(usedTranslationKeysHash).reduce((acc, key) => {
	acc.push(key);
	return acc;
}, []);

const jestConfig = {
	verbose: true,
	rootDir: paths.base(),
	modulePathIgnorePatterns: ['node_modules', '.yarn', 'dist', 'coverage', 'docs'],
	testEnvironment: '<rootDir>/packages/test/end-to-end/spectron.env.js',
	testMatch: [
		'<rootDir>/packages/test/end-to-end/shared-tests/**/?(*.)test.js',
		'<rootDir>/packages/desktop/test/**/?(*.)test.js',
	],
	globals: {
		isDebug: !!process.env.DEBUG,
		Accounts,
		timeout,
		localesHash,
		usedTranslationKeys,
	},
};

module.exports = jestConfig;
