import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Translate, I18n } from 'react-redux-i18n';
import classNames from 'classnames';
// import moment from 'moment-timezone';
import { Classes as BpClasses, Intent } from '@hitask/blueprint-core';
import { RecurPatterns, recurNeverEndEnabled } from '@hitask/constants/item';
import { getArrayOfLength, getRecurPatternById } from '@hitask/utils/helpers';
import { logRender } from '@hitask/utils/debug';
import DateInput from '../../containers/FormControls/DateInputContainer';
import { formatDateTimeField, parseDateTimeFieldIgnoreTime } from '../FormControls/DateInput';
import Select from '../FormControls/Select';
import SelectNative from '../FormControls/SelectNative';
import Checkbox from '../FormControls/Checkbox';
import DateTimeSummary from '../DateTimeSummary';
import formLayoutClasses from '../FormLayout';
import classes from './RecurringForm.scss';

const RecurringForm = ({
	handleSubmit,
	className,
	cancelCallback,
	recurType,
	recurInterval,
	recurEndDate,
	recurNeverEnd,
	category,
	startDate,
	startTime,
	endDate,
	endTime,
}) => {
	let recurIntervalUnit;
	switch (recurType) {
		case RecurPatterns.DAILY.id:
			recurIntervalUnit = __T('js.common.days');
			break;
		case RecurPatterns.WEEKLY.id:
			recurIntervalUnit = __T('js.common.weeks');
			break;
		case RecurPatterns.MONTHLY.id:
			recurIntervalUnit = __T('js.common.months');
			break;
		case RecurPatterns.YEARLY.id:
			recurIntervalUnit = __T('js.common.years');
			break;
		default:
			recurIntervalUnit = '';
	}

	// const localeData = moment.localeData();
	// const weekdaysShort = localeData.weekdaysShort();
	logRender('render RecurringForm');

	return (
		<form
			onSubmit={handleSubmit}
			className={classNames(formLayoutClasses.form, classes.form, className)}
			autoComplete="off"
		>
			<div
				className={classNames(
					classes.header,
					formLayoutClasses.header,
					BpClasses.POPOVER_HEADER,
					'pt-card-header'
				)}
			>
				<h3>
					<Translate value={__T('js.task.recurring_title')} />
				</h3>
			</div>
			<div className={classNames(formLayoutClasses.body, classes.body)}>
				<div className={formLayoutClasses.row}>
					<div className={classNames(formLayoutClasses.rowLabel, classes.rowLabel)}>
						<Translate value={__T('js.task.recurring')} />:
					</div>
					<div className={formLayoutClasses.rowContent}>
						<Field
							name="recurType"
							component={Select}
							items={Object.keys(RecurPatterns)
								.filter(key => !RecurPatterns[key].disabled)
								.map(key => ({
									id: RecurPatterns[key].id,
									label: I18n.t(RecurPatterns[key].label),
								}))}
						/>
					</div>
				</div>
				{recurType !== RecurPatterns.NONE.id && (
					<div className={classNames(formLayoutClasses.row, classes.dateInputRow)}>
						<div className={classNames(formLayoutClasses.rowLabel, classes.rowLabel)}>
							<Translate value={__T('js.task.recurring_end')} />:
						</div>
						<div className={formLayoutClasses.rowContent}>
							<Field
								name="recurEndDate"
								component={DateInput}
								disabled={recurNeverEnd}
								minDate={startDate}
								format={formatDateTimeField}
								parse={parseDateTimeFieldIgnoreTime}
								className={classes.dateInput}
								canClearSelection={false}
							/>
							{recurNeverEndEnabled && (
								<Field
									name="recurNeverEnd"
									component={Checkbox}
									label={I18n.t(__T('js.task.recurring_end_never'))}
									className={BpClasses.INLINE}
								/>
							)}
						</div>
					</div>
				)}
				{recurType !== RecurPatterns.NONE.id &&
					recurType !== RecurPatterns.WEEKDAYS.id && (
						<div className={formLayoutClasses.row}>
							<div
								className={classNames(formLayoutClasses.rowLabel, classes.rowLabel)}
							>
								<Translate value={__T('js.task.recurring_every')} />:
							</div>
							<div className={formLayoutClasses.rowContent}>
								<div>
									<Field
										name="recurInterval"
										component={SelectNative}
										items={getArrayOfLength(
											getRecurPatternById(recurType).recurIntervalSize
										).map(id => ({
											id: id + 1,
											label: `${id + 1}`,
										}))}
									/>
									<Translate value={recurIntervalUnit} />
								</div>
							</div>
						</div>
					)}
				{/* recurType === RecurPatterns.WEEKLY.id && RecurPatterns.WEEKLY.recurOnDayEnabled && (
					<div className={formLayoutClasses.row}>
						<div className={classNames(formLayoutClasses.rowLabel, classes.rowLabel)}>
							<Translate value={__T('js.task.recurring_on)} />:
						</div>
						<div className={classNames(formLayoutClasses.rowContent)}>
							<div className={classes.weekdaysRow}>
								{DateTimeUtils.getSortedWeekDays(firstDayOfWeek).map(day => (
									<label
										className={classNames(BpClasses.CONTROL, BpClasses.CHECKBOX, BpClasses.INLINE)}
										htmlFor={`repeat-on-${day.id}`}
										key={day.id}
									>
										<input
											type="checkbox"
											name={`recurOn${day.id}`}
											id={`repeat-on-${day.id}`}
											className={classes.weekdayIndicator}
											checked={this.state[`recurOn${day.id}`]}
										/>
										<span className={classNames(BpClasses.CONTROL_INDICATOR, classes.weekdayIndicator)} />
										{weekdaysShort[day.num]}
									</label>
								))}
							</div>
						</div>
					</div>
				) */}
				{/* recurType === RecurPatterns.MONTHLY.id && RecurPatterns.MONTHLY.recurByTypeEnabled && (
					<div className={formLayoutClasses.row}>
						<div className={classNames(formLayoutClasses.rowLabel, classes.rowLabel)}>
							<Translate value={__T('js.task.recurring_by)} />:
						</div>
						<div className={formLayoutClasses.rowContent}>
							<RadioGroup
								name="recurBy"
								selectedValue={this.state.recurBy}
							>
								{Object.keys(RecurBy).map(key => (
									<Radio
										label={I18n.t(RecurBy[key].label)}
										value={RecurBy[key].id}
										key={RecurBy[key].id}
										className="pt-inline"
									/>
								))}
							</RadioGroup>
						</div>
					</div>
				) */}
				{recurType !== RecurPatterns.NONE.id && (
					<div className={classNames(formLayoutClasses.row, classes.summaryRow)}>
						<div className={classNames(formLayoutClasses.rowLabel, classes.rowLabel)}>
							<Translate value={__T('js.task.recur.summary')} />:
						</div>
						<div className={formLayoutClasses.rowContent}>
							<DateTimeSummary
								recurType={recurType}
								recurInterval={recurInterval}
								recurEndDate={recurEndDate}
								recurNeverEnd={recurNeverEnd}
								category={category}
								startDate={startDate}
								startTime={startTime}
								endDate={endDate}
								endTime={endTime}
								plainText
							/>
						</div>
					</div>
				)}
			</div>
			<div
				className={classNames(
					classes.actionsBar,
					formLayoutClasses.actionsBar,
					BpClasses.POPOVER_FOOTER,
					'pt-card-footer'
				)}
			>
				<button
					type="button"
					className={classNames(BpClasses.BUTTON, BpClasses.POPOVER_DISMISS)}
					onClick={cancelCallback}
				>
					<Translate value={__T('js.task.cancel_button')} />
				</button>
				<button
					type="submit"
					className={classNames(BpClasses.BUTTON, BpClasses.intentClass(Intent.PRIMARY))}
				>
					<Translate value={__T('js.task.done')} />
				</button>
			</div>
		</form>
	);
};

const { string, func, number, bool } = PropTypes;
RecurringForm.propTypes = {
	handleSubmit: func.isRequired,
	className: string,
	cancelCallback: func,
	// Recur form values:
	recurType: number.isRequired,
	recurInterval: number.isRequired,
	recurEndDate: string,
	recurNeverEnd: bool.isRequired,
	// Item form values:
	category: number.isRequired,
	startDate: string.isRequired,
	startTime: string,
	endDate: string,
	endTime: string,
};

const emptyFunc = () => {};
RecurringForm.defaultProps = {
	className: '',
	cancelCallback: emptyFunc,
	recurEndDate: null,
	startTime: null,
	endDate: null,
	endTime: null,
};

export default RecurringForm;
