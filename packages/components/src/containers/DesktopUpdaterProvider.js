import { connect } from 'react-redux';
import { Overlays, openOverlay } from '@hitask/modules/overlays';
import DesktopUpdaterProvider from '../presentational/DesktopUpdaterProvider';

const mapActionCreators = dispatch => ({
	onUpdateReady: () => dispatch(openOverlay({ name: Overlays.APP_UPDATE })),
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapActionCreators)(DesktopUpdaterProvider);
