const isExtension = process.env.TARGET === 'ext-app' || process.env.TARGET === 'ext-calendar';

const BETA = process.env.ENV !== 'production';
module.exports = {
	Accounts: {
		main: {
			login: BETA ? 'autotest-login-testask' : 'autotest-login-production',
			password: 'autotest-password',
		},
	},
	Viewport: {
		width: isExtension ? 583 : 1280,
		height: isExtension ? 570 : 826,
	},
	timeout: 10000,
};
