const { ENV, TARGET, CHROME_STORE_SECRET } = require('./project.config');
const {
	clientId,
	refreshToken,
	extAppTestaskId,
	extAppProductionId,
	extCalendarTestaskId,
	extCalendarProductionId,
} = require('./conf.store.json');

module.exports = {
	extensionId:
		TARGET === 'ext-calendar'
			? ENV === 'production' ? extCalendarProductionId : extCalendarTestaskId
			: ENV === 'production' ? extAppProductionId : extAppTestaskId,
	clientId,
	refreshToken,
	clientSecret: CHROME_STORE_SECRET,
};
