import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { reduxForm, formValueSelector, change } from 'redux-form';
import { RecurFormDefaultValues, RecurTypes, recurNeverEndEnabled } from '@hitask/constants/item';
import { RECUR_PARAMS_FORM, submitRecurringParams } from '@hitask/modules/items';
import RecurringForm from '../presentational/RecurringForm';

const mapActionCreators = {};

const recurFormSelector = formValueSelector(RECUR_PARAMS_FORM);

const mapStateToProps = (state, { parentForm }) => {
	const parentFormValues = formValueSelector(parentForm)(
		state,
		'startDate',
		'startTime',
		'endDate',
		'endTime',
		'category',
		...Object.keys(RecurFormDefaultValues)
	);

	const { startDate } = parentFormValues;
	const startDateMoment = startDate ? moment(startDate) : moment().startOf('day'); // Form opened without startDate specified

	const suggestDefaults = parentFormValues.recurType === RecurTypes.NONE;
	const initialValues = Object.keys(RecurFormDefaultValues).reduce((acc, key) => {
		const parentValue = parentFormValues[key];
		switch (key) {
			case 'recurType':
				acc[key] = suggestDefaults // if the first form opening
					? RecurTypes.DAILY
					: parentValue;
				break;
			case 'recurEndDate':
				acc[key] = suggestDefaults
					? startDateMoment
							.clone()
							.add(7, 'day')
							.format()
					: parentValue;
				break;
			default:
				acc[key] = parentValue;
		}
		return acc;
	}, {});

	const formValues = Object.keys(RecurFormDefaultValues).reduce((acc, key) => {
		const value = recurFormSelector(state, key);
		acc[key] =
			value === undefined // if the first form opening
				? initialValues[key]
				: value;
		return acc;
	}, {});

	return {
		// Non-recurring form values:
		...parentFormValues,
		startDate: startDateMoment.format(),
		// Recurring form values:
		...formValues,
		// Redux-form params:
		initialValues,
		onChange(values, dispatch) {
			const form = RECUR_PARAMS_FORM;
			if (!values.recurEndDate) {
				if (recurNeverEndEnabled) {
					dispatch(change(form, 'recurNeverEnd', true));
				} else {
					dispatch(change(form, 'recurEndDate', initialValues.recurEndDate));
				}
			}
		},
	};
};

const RecurringFormWrapped = reduxForm({
	form: RECUR_PARAMS_FORM,
	onSubmit: (values, dispatch, props) => {
		const { parentForm, submitCallback } = props;

		const params = { ...values };
		if (params.recurType === RecurTypes.NONE) {
			params.recurInterval = null;
			params.recurBy = null;
			params.recurEndDate = null;
		}
		if (params.recurType !== RecurTypes.MONTHLY) {
			params.recurBy = null;
		}

		dispatch(
			submitRecurringParams({
				params,
				form: parentForm,
			})
		);
		submitCallback();
	},
	// onChange - mapped from mapStateToProps()
})(RecurringForm);

export default connect(mapStateToProps, mapActionCreators)(RecurringFormWrapped);
