export const tokenRequestOptions = {
	scope: [
		'https://www.googleapis.com/auth/userinfo.email',
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.googleapis.com/auth/plus.me',
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/tasks',
	].join(' '),
	accessType: 'offline',
};

export default {
	clientId: __GAUTH_CLIENT_ID__,
	clientSecret: __GAUTH_CLIENT_SECRET__,
	authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
	tokenUrl: 'https://accounts.google.com/o/oauth2/token',
	useBasicAuthorizationHeader: false,
	redirectUri: 'http://localhost',
};
