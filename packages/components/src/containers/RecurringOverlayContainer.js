import { connect } from 'react-redux';
import { Overlays, isOpenSelector, propsSelector, closeOverlay } from '@hitask/modules/overlays';
import RecurringOverlay from '../presentational/RecurringOverlay';

const mapActionCreators = dispatch => ({
	closeOverlay: () => dispatch(closeOverlay({ name: Overlays.RECURRING_FORM })),
});

const mapStateToProps = state => {
	const props = propsSelector(state, Overlays.RECURRING_FORM);
	return {
		isOpen: isOpenSelector(state, Overlays.RECURRING_FORM),
		...props,
	};
};

export default connect(mapStateToProps, mapActionCreators)(RecurringOverlay);
