export const signedInState = {
	auth: {
		session: {
			login: 'user-login',
			accountType: 'TEAM_BUSINESS',
			level: 201,
			sessionId: 'a08a27bc-27cc-4371-870a-c5bf0029f4e7',
			id: 190234,
			pictureHash: '1c1fc3fc-f23c-4b25-9e80-b033f64df9e2',
			emailConfirmed: 'example@test.com',
			email: 'example@test.com',
		},
		loading: false,
		error: null,
	},
};

export const signedOutState = {
	auth: {
		session: null,
		loading: false,
		error: {
			name: 'Server request error',
			message: 'Oops! Hitask service is experiencing an error. Please try again later.',
			response: {
				status: 403,
				statusText: 'Forbidden',
				errorMessage: 'Sorry, username or password is incorrect.',
				responseStatus: 1,
			},
		},
	},
};
