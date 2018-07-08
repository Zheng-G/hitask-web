import { connect } from 'react-redux';
import { lastItemsFetchTimeSelector, wereLoadedSelector } from '@hitask/modules/items';
import AuthorizedCalendarExt from '../presentational/AuthorizedCalendarExt';
import AuthorizedAppProvider from './AuthorizedAppProvider';
import TrackUserProvider from './TrackUserProvider';

const mapActionCreators = {};

const mapStateToProps = state => ({
	itemsWereLoaded: wereLoadedSelector(state),
	lastItemsFetchTime: lastItemsFetchTimeSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(
	AuthorizedAppProvider(TrackUserProvider(AuthorizedCalendarExt))
);
