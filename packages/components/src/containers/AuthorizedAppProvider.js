import { connect } from 'react-redux';
import { fetchItems } from '@hitask/modules/items';
import {
	loadPrefs,
	applyPrefsToMomentLocale,
	loadContacts,
	loadBusiness,
} from '@hitask/modules/user';
import { updateLocale } from '@hitask/modules/i18n';
import { Routes } from '@hitask/constants/layout';

const mapActionCreators = dispatch => ({
	fetchItems() {
		dispatch(fetchItems());
	},
	loadContactsAndBusiness() {
		dispatch(loadContacts());
		dispatch(loadBusiness());
	},
	loadPrefsAndApplyToLocale() {
		dispatch(loadPrefs())
			.then(() => dispatch(applyPrefsToMomentLocale()))
			.then(({ payload: locale }) => {
				if (!__ENABLE_LOCALES__) return null;
				return dispatch(updateLocale(locale));
			});
	},
	sendGATracking() {
		if (window.manualGAnalytics) {
			window.manualGAnalytics.pageview(Routes.APP, 'Main page');
		}
	},
});

const mapStateToProps = () => ({});

export default component => connect(mapStateToProps, mapActionCreators)(component);
