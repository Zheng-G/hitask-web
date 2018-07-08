import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import moment from 'moment-timezone';
import { Field } from 'redux-form';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import DateInput from '../../containers/FormControls/DateInputContainer';
import TimePicker from '../FormControls/TimePicker';
import Checkbox from '../FormControls/Checkbox';
import {
	formatDateTimeField,
	parseDateTimeField,
	parseDateTimeFieldIgnoreTime,
} from '../FormControls/DateInput';
import classes from './DateTimeInputs.scss';

/*
 * Dates are type of string in nirmalize functions. Convert them using moment()
 */
const normalizeTimePickerField = (timeName, value, previousValue, allValues) => {
	switch (timeName) {
		case 'startTime':
			if (!allValues.startDate) {
				return null;
			}
			if (
				allValues.startDate &&
				allValues.endDate &&
				allValues.startDate === allValues.endDate &&
				allValues.endTime &&
				moment(allValues.endTime).isBefore(moment(value))
			) {
				return allValues.endTime;
			}
			break;
		case 'endTime':
			if (!allValues.endDate) {
				return null;
			}
			if (
				allValues.startDate &&
				allValues.endDate &&
				allValues.startDate === allValues.endDate &&
				allValues.startTime &&
				moment(value).isBefore(moment(allValues.startTime))
			) {
				return allValues.startTime;
			}
			break;
		default:
	}
	return value;
};

const DateTimeInputs = ({
	dateName,
	timeName,
	checkboxName,
	minDate,
	maxDate,
	isAllDay,
	onSubmit,
}) => {
	logRender('render DateTimeInputs');
	return (
		<div className={classes.dateTimeInputs}>
			<Field
				name={dateName}
				component={DateInput}
				minDate={minDate}
				maxDate={maxDate}
				format={formatDateTimeField}
				parse={parseDateTimeFieldIgnoreTime}
			/>
			<Field
				name={timeName}
				component={TimePicker}
				format={formatDateTimeField}
				parse={parseDateTimeField}
				disabled={isAllDay}
				normalize={(value, previousValue, allValues) =>
					normalizeTimePickerField(timeName, value, previousValue, allValues)
				}
			/>
			<Field
				name={checkboxName}
				component={Checkbox}
				label={I18n.t(__T('js.task.is_all_day'))}
				className={BpClasses.INLINE}
			/>
			<button type="button" className={BpClasses.BUTTON} onClick={onSubmit}>
				<Translate value={__T('js.task.ok_button')} />
			</button>
		</div>
	);
};

const { string, bool, func } = PropTypes;
DateTimeInputs.propTypes = {
	dateName: PropTypes.string.isRequired,
	timeName: string.isRequired,
	checkboxName: string.isRequired,
	minDate: string,
	maxDate: string,
	isAllDay: bool,
	onSubmit: func,
};

const emptyFunc = () => {};
DateTimeInputs.defaultProps = {
	isAllDay: false,
	minDate: undefined,
	maxDate: undefined,
	onSubmit: emptyFunc,
};

export default DateTimeInputs;
