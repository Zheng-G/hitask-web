/**
 * @module constants/layout
 */

/**
 * Available app routes
 * @enum {String}
 */
export const Routes = {
	APP: '/',
	LOGIN: '/login',
	IMPORT: '/import',
	SETTINGS: '/settings',
	ARCHIVE: '/archive',
};

export const DEFAULT_ROUTE = __INDEPENDENT_IMPORT__ ? Routes.IMPORT : Routes.APP;

/**
 * Available item list groups
 * @enum {String}
 */
export const ItemGroups = {
	TODAY_OVERDUE: 'TODAY_OVERDUE',
	TODAY_MAIN: 'TODAY_MAIN',
	TODAY_COMPLETED: 'TODAY_COMPLETED',
	ALL_MAIN: 'ALL_MAIN',
	ALL_COMPLETED: 'ALL_COMPLETED',
};
