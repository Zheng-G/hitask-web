const { ENV, PRODUCT_NAME, APP_ID, paths } = require('./project.config');
const publishConfig = require('./publish.config');

const BETA = ENV !== 'production';
const config = {
	productName: PRODUCT_NAME,
	appId: APP_ID,
	artifactName: '${productName}.${ext}', // eslint-disable-line no-template-curly-in-string
	directories: {
		app: paths.dist(),
		buildResources: paths.project('resources-pack'),
		output: paths.outputs(),
	},

	// OSX platform:
	mac: {
		category: 'public.app-category.productivity',
		icon: BETA ? 'icon-beta.icns' : 'icon.icns',
		publish: publishConfig.mac,
	},
	dmg: {
		contents: [
			{
				x: 130,
				y: 220,
			},
			{
				x: 410,
				y: 220,
				type: 'link',
				path: '/Applications',
			},
		],
	},

	// Windows platform:
	win: {
		icon: BETA ? 'icon-beta.icns' : 'icon.icns',
		publish: publishConfig.win,
		publisherName: 'HUMAN COMPUTER, LLC',
	},
};

module.exports = config;
