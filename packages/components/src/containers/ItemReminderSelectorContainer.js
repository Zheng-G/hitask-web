import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Overlays, openOverlay } from '@hitask/modules/overlays';
import ItemReminderSelector from '../presentational/ItemReminderSelector';

const mapActionCreators = dispatch => ({
	openCustomReminderDialog: (parentForm, replaceIndex, initTime) =>
		dispatch(
			openOverlay({
				name: Overlays.CUSTOM_REMINDER,
				props: {
					parentForm,
					replaceIndex,
					initTime,
				},
			})
		),
});

const mapStateToProps = (state, { form }) => ({
	startDateDefined: !!formValueSelector(form)(state, 'startDate'),
});

export default connect(mapStateToProps, mapActionCreators)(ItemReminderSelector);
