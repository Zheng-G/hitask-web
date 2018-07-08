module.exports = {
	name: 'Hitask dev',
	permissions: [
		'contextMenus',
		'management',
		'tabs',
		'storage',
		'cookies',
		'https://testask.com/',
		'https://qatask.com/',
		'https://hitask.com/',
		'https://cdn.hitask.com/',
	],
	content_security_policy: [
		"default-src 'self' http://localhost:3000 http://localhost:3001",
		"font-src 'self' http://localhost:3000 http://localhost:3001 https://cdn.hitask.com",
		"script-src 'self' http://localhost:3000 http://localhost:3001 https://cdn.hitask.com 'unsafe-eval' 'sha256-CPbkA6xlx6EbHFrsB6YD4F99pTLewMUVM3xYm1Pt5hM='",
		'connect-src http://localhost:3000 http://localhost:3001 http://localhost:3005 ws://localhost:3002 https://testask.com https://qatask.com https://hitask.com https://cdn.hitask.com',
		"style-src * 'unsafe-inline' 'self' blob:",
		"img-src 'self' https://testask.com https://qatask.com https://hitask.com data: https://notify.bugsnag.com https://testask.s3.amazonaws.com https://qatask.s3.amazonaws.com https://hitask.s3.amazonaws.com;",
	].join('; '),
};
