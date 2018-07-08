import { connect } from 'react-redux';
import { lastItemsFetchTimeSelector } from '@hitask/modules/items';
import AuthorizedAppExt from '../presentational/AuthorizedAppExt';
import AuthorizedAppProvider from './AuthorizedAppProvider';
import TrackUserProvider from './TrackUserProvider';

const mapActionCreators = {};

const mapStateToProps = state => ({
	lastItemsFetchTime: lastItemsFetchTimeSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(
	AuthorizedAppProvider(TrackUserProvider(AuthorizedAppExt))
);
