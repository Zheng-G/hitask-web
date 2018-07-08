import { connect } from 'react-redux';
import { Overlays, closeOverlay, isOpenSelector, propsSelector } from '@hitask/modules/overlays';
import ImportSucceedDialog from '../../presentational/Dialogs/ImportSucceedDialog';

const overlayName = Overlays.IMPORT_SUCCEED;

const mapActionCreators = dispatch => ({
	closeDialog: () => dispatch(closeOverlay({ name: overlayName })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, overlayName),
	...propsSelector(state, overlayName),
});

export default connect(mapStateToProps, mapActionCreators)(ImportSucceedDialog);
