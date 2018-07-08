/* eslint function-paren-newline:0 */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { themeIdSelector } from '@hitask/modules/user';
import { updateLocale, availableLocalesSelector } from '@hitask/modules/i18n';
import DnDContextProvider from './DnDContextProvider';
import TrackUserProvider from './TrackUserProvider';
import CoreLayout from '../presentational/CoreLayout';

const mapActionCreators = {
	updateLocale,
};

const mapStateToProps = state => ({
	themeId: themeIdSelector(state),
	noLocales: availableLocalesSelector(state).length === 0,
});

export default withRouter(
	connect(mapStateToProps, mapActionCreators)(DnDContextProvider(TrackUserProvider(CoreLayout)))
);
