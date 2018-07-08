import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import { Tooltip2 } from '@hitask/blueprint-labs';
import { ItemCategories, RecurTypes, StartEndPatterns } from '@hitask/constants/item';
import { getStartEndPattern } from '@hitask/utils/helpers';
import { logRender } from '@hitask/utils/debug';
import RecurringDateTimeSummary from './RecurringDateTimeSummary';
import classes from './DateTimeSummary.scss';

class DateTimeSummary extends PureComponent {
	render() {
		if (this.props.recurType !== RecurTypes.NONE) return RecurringDateTimeSummary(this.props);

		const {
			startDate: startDateStr,
			startTime: startTimeStr,
			endDate: endDateStr,
			endTime: endTimeStr,
			linkClassName,
			category,
			handleStartDateClick,
			handleStartTimeClick,
			handleEndDateClick,
			handleEndTimeClick,
			handleRepeatClick,
			plainText,
		} = this.props;

		const startDate = startDateStr && moment(startDateStr);
		const startTime = startTimeStr && moment(startTimeStr);
		const endDate = endDateStr && moment(endDateStr);
		const endTime = endTimeStr && moment(endTimeStr);

		const setEndMessage =
			category === ItemCategories.EVENT ? __T('js.task.set_end') : __T('js.task.set_due');
		const changeEndMessage =
			category === ItemCategories.EVENT
				? __T('js.task.change_end')
				: __T('js.task.change_due');
		const pattern = getStartEndPattern({
			startDate,
			startTime,
			endDate,
			endTime,
		});
		logRender('render DateTimeSummary');

		switch (pattern) {
			case StartEndPatterns.START: // 1 Jan 2017 Set Due... Repeat...
				return plainText ? (
					<span>{startDate.format('LL')}</span>
				) : (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick} className={linkClassName}>
							{startDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleEndDateClick}>
							<Translate value={setEndMessage} />
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
			case StartEndPatterns.START_TIME: // 1 Jan 2017 13:00 Set Due... Repeat...
				return plainText ? (
					<span>
						{startDate.format('LL')} {startTime.format('LT')}
					</span>
				) : (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick} className={linkClassName}>
							{startDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
							{startTime.format('LT')}
						</a>&nbsp;
						<a href={null} onClick={handleEndDateClick}>
							<Translate value={setEndMessage} />
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
			case StartEndPatterns.START_END_SAME: // 1 Jan 2017 Change due... Repeat...
				return plainText ? (
					<span>{startDate.format('LL')}</span>
				) : (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick} className={linkClassName}>
							{startDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleEndDateClick}>
							<Translate value={changeEndMessage} />
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
			case StartEndPatterns.START_END_TIME_SAME: // 1 Jan 2017 13:00 - 20:00 Repeat...
				return plainText ? (
					<span>
						{startDate.format('LL')} {startTime.format('LT')} - {endTime.format('LT')}
					</span>
				) : (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick} className={linkClassName}>
							{startDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
							{startTime.format('LT')}
						</a>{' '}
						<span>-</span>{' '}
						<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
							{endTime.format('LT')}
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
			case StartEndPatterns.START_END: // 1 Jan 2017 → 2 Jan 2017 Repeat...
				return plainText ? (
					<span>
						{startDate.format('LL')}{' '}
						<span
							className={classNames(
								BpClasses.ICON_STANDARD,
								BpClasses.iconClass('arrow-right')
							)}
						/>{' '}
						{endDate.format('LL')}
					</span>
				) : (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick} className={linkClassName}>
							{startDate.format('LL')}
						</a>&nbsp;
						<span
							className={classNames(
								BpClasses.ICON_STANDARD,
								BpClasses.iconClass('arrow-right')
							)}
						/>&nbsp;
						<a href={null} onClick={handleEndDateClick} className={linkClassName}>
							{endDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
			case StartEndPatterns.START_END_TIME: // 1 Jan 2017 13:00 → 2 Jan 2017 20:00
				return plainText ? (
					<span>
						{startDate.format('LL')} {startTime.format('LT')}{' '}
						<span
							className={classNames(
								BpClasses.ICON_STANDARD,
								BpClasses.iconClass('arrow-right')
							)}
						/>{' '}
						{endDate.format('LL')} {endTime.format('LT')}
					</span>
				) : (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick} className={linkClassName}>
							{startDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
							{startTime.format('LT')}
						</a>&nbsp;
						<span
							className={classNames(
								BpClasses.ICON_STANDARD,
								BpClasses.iconClass('arrow-right')
							)}
						/>&nbsp;
						<a href={null} onClick={handleEndDateClick} className={linkClassName}>
							{endDate.format('LL')}
						</a>&nbsp;
						<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
							{endTime.format('LT')}
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
			case StartEndPatterns.END: // Due 1 Jan 2017 Set start... Repeat...
				return plainText ? (
					<span>Due {endDate.format('LL')}</span>
				) : (
					<span className={classes.container}>
						<span>
							Due{' '}
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.format('LL')}
							</a>
						</span>&nbsp;
						<a href={null} onClick={handleStartDateClick}>
							<Translate value={__T('js.task.set_start')} />
						</a>&nbsp;
						<Tooltip2 content={I18n.t(__T('js.task.recurring_disabled'))}>
							<a href={null} className={classes.disabledLink}>
								<Translate value={__T('js.task.repeat')} />
							</a>
						</Tooltip2>
					</span>
				);
			case StartEndPatterns.END_TIME: // Due 1 Jan 2017 13:00 Set start... Repeat...
				return plainText ? (
					<span>
						Due {endDate.format('LL')} {endTime.format('LT')}
					</span>
				) : (
					<span className={classes.container}>
						<span>
							Due{' '}
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.format('LL')}
							</a>
						</span>&nbsp;
						<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
							{endTime.format('LT')}
						</a>&nbsp;
						<a href={null} onClick={handleStartDateClick}>
							<Translate value={__T('js.task.set_start')} />
						</a>&nbsp;
						<Tooltip2 content={I18n.t(__T('js.task.recurring_disabled'))}>
							<a
								href={null}
								onClick={handleRepeatClick}
								className={classes.disabledLink}
							>
								<Translate value={__T('js.task.repeat')} />
							</a>
						</Tooltip2>
					</span>
				);
			default:
				// Set Start... Set Due... Repeat...
				return (
					<span className={classes.container}>
						<a href={null} onClick={handleStartDateClick}>
							<Translate value={__T('js.task.set_start')} />
						</a>&nbsp;
						<a href={null} onClick={handleEndDateClick}>
							<Translate value={setEndMessage} />
						</a>&nbsp;
						<a href={null} onClick={handleRepeatClick}>
							<Translate value={__T('js.task.repeat')} />
						</a>
					</span>
				);
		}
	}
}

const { func, string, number, bool } = PropTypes;
DateTimeSummary.propTypes = {
	handleStartDateClick: func,
	handleStartTimeClick: func,
	handleEndDateClick: func,
	handleEndTimeClick: func,
	handleRepeatClick: func,
	category: number.isRequired,
	recurType: number.isRequired,
	startDate: string,
	startTime: string,
	endDate: string,
	endTime: string,
	linkClassName: string,
	plainText: bool,
};

const emptyFunc = () => {};
DateTimeSummary.defaultProps = {
	handleStartDateClick: emptyFunc,
	handleStartTimeClick: emptyFunc,
	handleEndDateClick: emptyFunc,
	handleEndTimeClick: emptyFunc,
	handleRepeatClick: emptyFunc,
	startDate: null,
	startTime: null,
	endDate: null,
	endTime: null,
	linkClassName: '',
	plainText: false,
};

export default DateTimeSummary;
