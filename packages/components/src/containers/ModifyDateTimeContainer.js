import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Overlays, openOverlay } from '@hitask/modules/overlays';
import ModifyDateTime from '../presentational/ModifyDateTime';

const mapActionCreators = (dispatch, { form }) => ({
	openRecurringOverlay() {
		dispatch(
			openOverlay({
				name: Overlays.RECURRING_FORM,
				props: { form },
			})
		);
	},
});

const mapStateToProps = (state, { form }) => {
	const formValues = formValueSelector(form)(
		state,
		'category',
		'startDate',
		'startTime',
		'endDate',
		'endTime',
		'isAllDay',
		'recurType',
		'recurInterval',
		'recurEndDate',
		'recurNeverEnd'
	);
	return {
		...formValues,
	};
};

export default connect(mapStateToProps, mapActionCreators)(ModifyDateTime);
