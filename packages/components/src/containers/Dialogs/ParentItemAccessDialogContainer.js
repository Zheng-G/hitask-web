import { connect } from 'react-redux';
import { allowItemAccess } from '@hitask/modules/items';
import { Overlays, closeOverlay, isOpenSelector, propsSelector } from '@hitask/modules/overlays';
import ParentItemAccessDialog from '../../presentational/Dialogs/ParentItemAccessDialog';

const overlayName = Overlays.PARENT_ITEM_ACCESS;

const mapActionCreators = dispatch => ({
	closeDialog: () => dispatch(closeOverlay({ name: overlayName })),
	allowItemAccess: ({ itemId, userId, level }) =>
		dispatch(allowItemAccess({ itemId, userId, level })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, overlayName),
	...propsSelector(state, overlayName),
});

export default connect(mapStateToProps, mapActionCreators)(ParentItemAccessDialog);
