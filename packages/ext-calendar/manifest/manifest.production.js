module.exports = {
	permissions: [
		'contextMenus',
		'tabs',
		'storage',
		'cookies',
		'https://hitask.com/',
		'https://cdn.hitask.com/',
	],
	content_security_policy: [
		"default-src 'self'",
		"font-src 'self' https://cdn.hitask.com",
		"script-src 'self' https://ssl.google-analytics.com https://cdn.hitask.com",
		'connect-src https://hitask.com https://cdn.hitask.com',
		"style-src * 'unsafe-inline' 'self' blob:",
		"img-src 'self' https://hitask.com data: https://notify.bugsnag.com http://www.google-analytics.com https://hitask.s3.amazonaws.com;",
	].join('; '),
};
