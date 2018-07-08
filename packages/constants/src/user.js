/**
 * @module constants/user
 */

/**
 * Levels of user membership
 * @enum {String}
 */
export const BusinessLevels = {
	MEMBER: 'MEMBER',
	MANAGER: 'MANAGER',
	ADMIN: 'ADMIN',
	OWNER: 'OWNER',
};

/**
 * Configuration for user membership levels
 */
export const BusinessLevelsConfig = {
	PERSONAL: {
		MEMBER: 1,
		MANAGER: 2,
		ADMIN: 10,
		OWNER: 100,
	},
	TEAM_THRESHOLD: 200,
	TEAM: {
		MEMBER: 1 + 200,
		MANAGER: 2 + 200,
		ADMIN: 10 + 200,
		OWNER: 100 + 200,
	},
};

export const SubscriptionType = {
	BUSINESS: 'BIS',
	BUSINESS_WAIT: 'BIS_WAIT',
};
