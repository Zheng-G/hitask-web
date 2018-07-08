import { connect } from 'react-redux';
import { Overlays, openOverlay, closeOverlay, isOpenSelector } from '@hitask/modules/overlays';
import NewItemCreateSuccessDialog from '../../presentational/Dialogs/NewItemCreateSuccessDialog';

const mapActionCreators = dispatch => ({
	openDialog: () => dispatch(openOverlay({ name: Overlays.NEW_ITEM_CREATE_SUCCESS })),
	closeDialog: () => dispatch(closeOverlay({ name: Overlays.NEW_ITEM_CREATE_SUCCESS })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, Overlays.NEW_ITEM_CREATE_SUCCESS),
});

export default connect(mapStateToProps, mapActionCreators)(NewItemCreateSuccessDialog);
