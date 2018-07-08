import { connect } from 'react-redux';
import { Overlays, isOpenSelector, propsSelector, closeOverlay } from '@hitask/modules/overlays';
import ItemViewDialog from '../../presentational/Dialogs/ItemViewDialog';

const mapActionCreators = dispatch => ({
	closeDialog: () => dispatch(closeOverlay({ name: Overlays.ITEM_VIEW })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, Overlays.ITEM_VIEW),
	...propsSelector(state, Overlays.ITEM_VIEW),
});

export default connect(mapStateToProps, mapActionCreators)(ItemViewDialog);
