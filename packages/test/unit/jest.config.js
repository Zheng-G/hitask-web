const path = require('path');

const PACKAGES_TO_TEST = [
	// 'components',
	'modules',
	'utils',
];

const IGNORED_FOLDERS = ['node_modules', '.yarn', 'dist', 'coverage', 'docs'];

const globals = {
	__DEV__: false,
	__PROD__: false,
	__ENV__: '"testask"',
	__LOG_RENDER__: false,
	__ENABLE_LOCALES__: false,
	__APP_VERSION__: '""',
	__BUILD_ID__: '""',
	__TARGET__: '"webapp"',
	__LOCALES_SOURCE__: '"internal"',
	__ENABLE_SETTINGS__: false,
	__ENABLE_IMPORT__: true,
	__INDEPENDENT_IMPORT__: true,
	__PLAY_APP_BASE_URL__: '"https://testask.com"',
	__NODE_APP_BASE_URL__: '"https://app.testask.com"',
	__API_VERSION__: 2,
	__API_KEY__: '"hitask_api_key_test"',
	__API_BASE_URL__: '"https://testask.com"',
	__API_BASE_HOST__: '"testask.com"',
	__API_URL_INDEX__: '"api/v5"',
};

const jestConfig = {
	verbose: true,
	rootDir: path.join(__dirname, '../../../'),
	modulePathIgnorePatterns: IGNORED_FOLDERS,
	watchPathIgnorePatterns: IGNORED_FOLDERS,
	testMatch: PACKAGES_TO_TEST.map(
		packageName => `<rootDir>/packages/${packageName}/**/?(*.)(test).js`
	),
	moduleNameMapper: {
		'.scss': 'identity-obj-proxy',
		'.svg': '<rootDir>/packages/resources/icons/__mocks__/Icon.mock',
		'^@hitask/(.*)/(.*)$': '@hitask/$1/src/$2',
	},
	transformIgnorePatterns: ['node_modules/(?!@hitask)'],
	transform: {
		'.js': 'babel-jest',
	},
	collectCoverageFrom: PACKAGES_TO_TEST.map(
		packageName => `<rootDir>/packages/${packageName}/**/*.js`
	).concat(['!**/*.mock.js']),
	coverageThreshold: {
		global: {
			branches: 25,
			functions: 13,
			lines: 30,
			statements: 28,
		},
	},
	setupTestFrameworkScriptFile: '<rootDir>/packages/test/unit/setup.js',
	globals,
	bail: true,
};

module.exports = jestConfig;
