import { connect } from 'react-redux';
import { Overlays, closeOverlay, isOpenSelector, propsSelector } from '@hitask/modules/overlays';
import EditItemDialog from '../../presentational/Dialogs/EditItemDialog';

const overlayName = Overlays.EDIT_ITEM_FORM;
const mapActionCreators = dispatch => ({
	closeDialog() {
		dispatch(closeOverlay({ name: overlayName }));
	},
});

const mapStateToProps = state => {
	const dialogProps = propsSelector(state, overlayName);
	return {
		...dialogProps,
		isOpen: isOpenSelector(state, overlayName),
	};
};

export default connect(mapStateToProps, mapActionCreators)(EditItemDialog);
