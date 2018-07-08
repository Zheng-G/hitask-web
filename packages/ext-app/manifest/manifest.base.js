module.exports = {
	// 'version' property is set during build, based on version from package.json
	name: 'Hitask - Team Task management',
	short_name: 'Hitask',
	manifest_version: 2,
	description: 'Quickly create tasks in your Hitask account directly from your browser toolbar.',
	homepage_url: 'https://hitask.com',
	browser_action: {
		default_popup: 'popup.html',
	},
	icons: {
		16: 'images/fav.png',
		48: 'images/fav_48.png',
		128: 'images/fav_128.png',
	},
	background: {
		page: 'background.html',
	},
	options_ui: {
		page: 'options.html',
		chrome_style: false,
	},
};
