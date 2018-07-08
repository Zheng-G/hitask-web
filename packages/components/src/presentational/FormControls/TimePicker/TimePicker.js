import React from 'react';
import PropTypes from 'prop-types';
import { TimePicker as BpTimePicker } from '@hitask/blueprint-datetime';
import classNames from 'classnames';
import { getDefaultTime } from '@hitask/constants/calendar';
import { FieldInputShape } from '../common';
import classes from './TimePicker.scss';

class TimePicker extends React.PureComponent {
	render() {
		const { input, className, ...other } = this.props;
		return (
			<BpTimePicker
				{...input}
				value={input.value || getDefaultTime().toDate()}
				className={classNames(classes.timePicker, className)}
				{...other}
			/>
		);
	}
}

TimePicker.propTypes = {
	input: FieldInputShape.isRequired,
	className: PropTypes.string,
};

TimePicker.defaultProps = {
	className: '',
};

export default TimePicker;
