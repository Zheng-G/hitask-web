import { connect } from 'react-redux';
import { getLocalWebappSession, hasSessionSelector } from '@hitask/modules/auth';
import { themeIdSelector } from '@hitask/modules/user';
import { updateLocale, availableLocalesSelector } from '@hitask/modules/i18n';
import ChromeCalendarExtension from '../presentational/ChromeExtension/ChromeCalendarExtension';

const mapActionCreators = {
	getLocalWebappSession,
	updateLocale,
};

const mapStateToProps = state => ({
	hasSession: hasSessionSelector(state),
	noLocales: availableLocalesSelector(state).length === 0,
	themeId: themeIdSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ChromeCalendarExtension);
