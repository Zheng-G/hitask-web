import { connect } from 'react-redux';
import { Overlays, closeOverlay, isOpenSelector, propsSelector } from '@hitask/modules/overlays';
import { completeItem } from '@hitask/modules/items';
import { collapseAllItems } from '@hitask/modules/tabs';
import { instantUpdatePrefs } from '@hitask/modules/user';
import ConfirmItemCompleteAlert from '../../presentational/Alerts/ConfirmItemCompleteAlert';

const mapActionCreators = dispatch => ({
	completeItem: (itemId, disableNextTime, recurInstanceDate) => {
		dispatch(completeItem({ itemId, completed: true, recurInstanceDate }));
		if (disableNextTime) {
			dispatch(instantUpdatePrefs({ show_confirmation_complete: false }));
		}
		dispatch(collapseAllItems({}));
	},
	closeAlert: () => dispatch(closeOverlay({ name: Overlays.CONFIRM_ITEM_COMPLETE })),
});

const mapStateToProps = state => ({
	isOpen: isOpenSelector(state, Overlays.CONFIRM_ITEM_COMPLETE),
	...propsSelector(state, Overlays.CONFIRM_ITEM_COMPLETE),
});

export default connect(mapStateToProps, mapActionCreators)(ConfirmItemCompleteAlert);
