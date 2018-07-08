import { connect } from 'react-redux';
import { errorSelector } from '@hitask/modules/items';
import { Overlays, openOverlay, closeOverlay, isOpenSelector } from '@hitask/modules/overlays';
import NewItemCreateFailDialog from '../../presentational/Dialogs/NewItemCreateFailDialog';

const mapActionCreators = dispatch => ({
	openDialog: () => dispatch(openOverlay({ name: Overlays.NEW_ITEM_CREATE_FAIL })),
	closeDialog: () => dispatch(closeOverlay({ name: Overlays.NEW_ITEM_CREATE_FAIL })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, Overlays.NEW_ITEM_CREATE_FAIL),
	error: errorSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(NewItemCreateFailDialog);
