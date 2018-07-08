import { connect } from 'react-redux';
import { Overlays, closeOverlay, isOpenSelector, propsSelector } from '@hitask/modules/overlays';
import InfoMessageAlert from '../../presentational/Alerts/InfoMessageAlert';

const mapActionCreators = dispatch => ({
	closeAlert: () => dispatch(closeOverlay({ name: Overlays.INFO_MESSAGE })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, Overlays.INFO_MESSAGE),
	...propsSelector(state, Overlays.INFO_MESSAGE),
});

export default connect(mapStateToProps, mapActionCreators)(InfoMessageAlert);
