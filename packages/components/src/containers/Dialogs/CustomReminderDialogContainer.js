import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { submitNewCustomReminder } from '@hitask/modules/items';
import { Overlays, closeOverlay, isOpenSelector, propsSelector } from '@hitask/modules/overlays';
import CustomReminderDialog from '../../presentational/Dialogs/CustomReminderDialog';

const mapActionCreators = dispatch => ({
	closeDialog() {
		dispatch(closeOverlay({ name: Overlays.CUSTOM_REMINDER }));
	},
	handleSubmit({ date, replaceIndex, form }) {
		dispatch(
			submitNewCustomReminder({
				date,
				replaceIndex,
				form,
			})
		);
		dispatch(closeOverlay({ name: Overlays.CUSTOM_REMINDER }));
	},
});

const mapStateToProps = state => {
	const dialogProps = propsSelector(state, Overlays.CUSTOM_REMINDER);
	const { initTime, parentForm, replaceIndex, ...rest } = dialogProps;
	return {
		...rest,
		isOpen: isOpenSelector(state, Overlays.CUSTOM_REMINDER),
		form: parentForm,
		replaceIndex,
		initDateValue: initTime
			? moment(initTime).format()
			: moment()
					.startOf('day') // Ignore hours, seconds and miliseconds to avoid rerendering
					.add(1, 'day')
					.format(),
		initTimeValue: initTime
			? moment(initTime).format()
			: moment()
					.startOf('hour') // Ignore seconds and miliseconds to avoid rerendering
					.hours(7)
					.format(),
	};
};

export default connect(mapStateToProps, mapActionCreators)(CustomReminderDialog);
