import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { Button, Intent, Classes as BpClasses } from '@hitask/blueprint-core';
import { mergeDateTimeObjects } from '@hitask/utils/DateTimeUtils';
import { logRender } from '@hitask/utils/debug';
import DateInput from '../../containers/FormControls/DateInputContainer';
import { formatDateTimeField } from '../FormControls/DateInput';
import TimePicker from '../FormControls/TimePicker';
import classes from './CustomReminderForm.scss';

class CustomReminderForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: props.initDateValue,
			time: props.initTimeValue,
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.handleTimeChange = this.handleTimeChange.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.handleSubmit({
			date: mergeDateTimeObjects(moment(this.state.date), moment(this.state.time)),
			replaceIndex: this.props.replaceIndex,
			form: this.props.form,
		});
	}

	handleDateChange(value) {
		this.setState({
			date: value,
		});
	}

	handleTimeChange(value) {
		this.setState({
			time: value,
		});
	}

	render() {
		logRender('render CustomReminderForm');
		return (
			<form onSubmit={this.onSubmit} className={classes.form} autoComplete="off">
				<DateInput
					input={{
						value: formatDateTimeField(this.state.date),
						onChange: this.handleDateChange,
					}}
					meta={{}}
				/>
				<TimePicker
					input={{
						value: formatDateTimeField(this.state.time),
						onChange: this.handleTimeChange,
					}}
					meta={{}}
					className={classes.timePicker}
				/>
				<footer className={classNames(BpClasses.DIALOG_FOOTER_ACTIONS, classes.footer)}>
					<Button
						text={I18n.t(__T('js.task.cancel_button'))}
						onClick={this.props.onCancel}
					/>
					<Button
						text={I18n.t(__T('js.task.set_button'))}
						intent={Intent.PRIMARY}
						onClick={this.onSubmit}
					/>
				</footer>
			</form>
		);
	}
}

const { func, number, string } = PropTypes;
CustomReminderForm.propTypes = {
	handleSubmit: func.isRequired,
	onCancel: func.isRequired,
	initDateValue: string,
	initTimeValue: string,
	replaceIndex: number,
	form: string,
};

CustomReminderForm.defaultProps = {
	initDateValue: null,
	initTimeValue: null,
	replaceIndex: -1,
	form: null,
};

export default CustomReminderForm;
