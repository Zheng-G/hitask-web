import { connect } from 'react-redux';
import { Overlays, closeOverlay, isOpenSelector } from '@hitask/modules/overlays';
import { APP_UPDATE_CONFIRM } from '@hitask/constants/ipcEvents';
import DesktopUpdateDialog from '../../presentational/Dialogs/DesktopUpdateDialog';

const ipc = window.ipc;
const mapActionCreators = dispatch => ({
	closeDialog() {
		dispatch(closeOverlay({ name: Overlays.APP_UPDATE }));
	},
	onConfirm() {
		if (!ipc) return;
		ipc.send(APP_UPDATE_CONFIRM);
	},
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, Overlays.APP_UPDATE),
});

export default connect(mapStateToProps, mapActionCreators)(DesktopUpdateDialog);
