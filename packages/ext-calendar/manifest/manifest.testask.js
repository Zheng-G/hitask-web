module.exports = {
	name: 'Hitask Calendar beta',
	permissions: [
		'contextMenus',
		'tabs',
		'storage',
		'cookies',
		'https://testask.com/',
		'https://cdn.hitask.com/',
	],
	content_security_policy: [
		"default-src 'self'",
		"font-src 'self' https://cdn.hitask.com",
		"script-src 'self' https://ssl.google-analytics.com https://cdn.hitask.com",
		'connect-src https://testask.com https://cdn.hitask.com/',
		"style-src * 'unsafe-inline' 'self' blob:",
		"img-src 'self' https://testask.com data: https://notify.bugsnag.com http://www.google-analytics.com https://testask.s3.amazonaws.com;",
	].join('; '),
};
