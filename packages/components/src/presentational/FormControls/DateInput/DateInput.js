import React from 'react';
import PropTypes from 'prop-types';
import { DateInput as BpDateInput } from '@hitask/blueprint-datetime';
import classNames from 'classnames';
import { getMaxPossibleDate } from '@hitask/constants/calendar';
import { FieldInputShape, FieldMetaShape } from '../common';
import { formatDateTimeField, localeUtils, getInitialMonth } from './common';
import classes from './DateInput.scss';

class DateInput extends React.PureComponent {
	render() {
		const {
			input,
			meta,
			className,
			minDate,
			maxDate,
			modifiers,
			popoverProps,
			...other
		} = this.props;
		return (
			<BpDateInput
				{...input}
				value={input.value}
				className={classNames(classes.dateInput, className)}
				minDate={minDate ? formatDateTimeField(minDate) : undefined}
				maxDate={maxDate ? formatDateTimeField(maxDate) : undefined}
				initialMonth={getInitialMonth(input.value, minDate)}
				popoverProps={{
					inline: false,
					...popoverProps,
					tetherOptions: {
						constraints: [{ attachment: 'together', to: 'window' }],
						...popoverProps.tetherOptions,
					},
				}}
				localeUtils={localeUtils}
				modifiers={Object.assign(modifiers, {
					today: new Date(),
				})}
				{...other}
			/>
		);
	}
}

const maxPossibleDateStr = getMaxPossibleDate().format();
const { string, shape } = PropTypes;
DateInput.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	className: string,
	minDate: string,
	maxDate: string,
	modifiers: shape({}),
	popoverProps: shape({}),
};

DateInput.defaultProps = {
	className: '',
	minDate: undefined,
	maxDate: maxPossibleDateStr,
	modifiers: {},
	popoverProps: {},
};

export default DateInput;
