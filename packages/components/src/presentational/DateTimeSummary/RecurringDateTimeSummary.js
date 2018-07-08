import React from 'react';
import moment from 'moment-timezone';
import { I18n, Translate } from 'react-redux-i18n';
import {
	ItemCategories,
	RecurTypes,
	RecurPatterns,
	StartEndPatterns,
} from '@hitask/constants/item';
import { getStartEndPattern } from '@hitask/utils/helpers';
import { logRender } from '@hitask/utils/debug';
import classes from './DateTimeSummary.scss';

// Props are checked in parent DateTimeSummary component
const RecurringDateTimeSummary = props => {
	const {
		startDate: startDateStr,
		startTime: startTimeStr,
		endDate: endDateStr,
		endTime: endTimeStr,
		recurEndDate: recurEndDateStr,
		linkClassName,
		category,
		recurType,
		recurInterval,
		recurNeverEnd,
		handleStartDateClick,
		handleStartTimeClick,
		handleEndDateClick,
		handleEndTimeClick,
		handleRepeatClick,
		plainText,
	} = props;

	const startDate = startDateStr && moment(startDateStr);
	const startTime = startTimeStr && moment(startTimeStr);
	const endDate = endDateStr && moment(endDateStr);
	const endTime = endTimeStr && moment(endTimeStr);
	const recurEndDate = recurEndDateStr && moment(recurEndDateStr);

	const pattern = getStartEndPattern({
		startDate,
		startTime,
		endDate,
		endTime,
	});
	logRender('render RecurringDateTimeSummary');

	let recurTypeText = `${I18n.t(__T('js.task.recur.every'))} `;
	switch (recurType) {
		case RecurPatterns.DAILY.id:
			recurTypeText +=
				recurInterval === 1
					? I18n.t(__T('js.common.day'))
					: `${recurInterval} ${I18n.t(__T('js.common.days'))}`;
			break;
		case RecurPatterns.WEEKLY.id:
			recurTypeText +=
				recurInterval === 1
					? I18n.t(__T('js.common.week'))
					: `${recurInterval} ${I18n.t(__T('js.common.weeks'))}`;
			break;
		case RecurPatterns.MONTHLY.id:
			recurTypeText +=
				recurInterval === 1
					? I18n.t(__T('js.common.month'))
					: `${recurInterval} ${I18n.t(__T('js.common.months'))}`;
			break;
		case RecurPatterns.YEARLY.id:
			recurTypeText +=
				recurInterval === 1
					? I18n.t(__T('js.common.year'))
					: `${recurInterval} ${I18n.t(__T('js.common.years'))}`;
			break;
		case RecurPatterns.WEEKDAYS.id:
			recurTypeText += I18n.t(__T('js.common.weekday'));
			break;
		default:
			console.error('Error in recurring summary: undefined recurring type');
			return null;
	}
	const recurTypeLabel = plainText ? (
		recurTypeText
	) : (
		<a href={null} onClick={handleRepeatClick} className={linkClassName}>
			{recurTypeText}
		</a>
	);

	let recurEndDatePrefix = '';
	let recurEndDateLabel = '';
	if (recurEndDate && !recurNeverEnd) {
		recurEndDatePrefix = plainText ? (
			I18n.t(__T('js.task.recur.until'))
		) : (
			<Translate value={__T('js.task.recur.until')} />
		);
		recurEndDateLabel = plainText ? (
			recurEndDate.format('LL')
		) : (
			<a href={null} onClick={handleRepeatClick} className={linkClassName}>
				{recurEndDate.format('LL')}
			</a>
		);
	}

	const setEndMessage =
		category === ItemCategories.EVENT ? __T('js.task.set_end') : __T('js.task.set_due');
	const setEndLabel = !plainText && (
		<a href={null} onClick={handleEndDateClick}>
			<Translate value={setEndMessage} />
		</a>
	);
	const cangeEndMessage =
		category === ItemCategories.EVENT ? __T('js.task.change_end') : __T('js.task.change_due');
	const changeEndLabel = !plainText && (
		<a href={null} onClick={handleEndDateClick}>
			<Translate value={cangeEndMessage} />
		</a>
	);

	switch (recurType) {
		case RecurTypes.DAILY:
			switch (pattern) {
				// StartEndPatterns.START is default
				case StartEndPatterns.START_TIME: // Every day at 13:00 starting 1 Jan 2017 Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.at'))}{' '}
							{startTime.format('LT')} {I18n.t(__T('js.task.recur.starting'))}{' '}
							{startDate.format('LL')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.at')} />&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.starting')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('LL')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_SAME: // Every day starting 1 Jan 2017 Change End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.starting'))}{' '}
							{startDate.format('LL')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.starting')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('LL')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {changeEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME_SAME: // Every day 13:00 - 17:00 starting 1 Jan 2017
					return plainText ? (
						<span>
							{recurTypeLabel} {startTime.format('LT')} <span>-</span>{' '}
							{endTime.format('LT')} {I18n.t(__T('js.task.recur.starting'))}{' '}
							{startDate.format('LL')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>{' '}
							<span>-</span>{' '}
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.starting')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('LL')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {changeEndLabel}
						</span>
					);
				default:
					// Every day starting 1 Jan 2017 Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.starting'))}{' '}
							{startDate.format('LL')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.starting')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('LL')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
			}

		case RecurTypes.WEEKLY:
			switch (pattern) {
				// StartEndPatterns.START is default
				case StartEndPatterns.START_TIME: // Every week on Tuesday at 13:00 Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('dddd')} {I18n.t(__T('js.task.recur.at'))}{' '}
							{startTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('dddd')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.at')} />&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_SAME: // Every week on Tuesday Change End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('dddd')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('dddd')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {changeEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME_SAME: // Every week on Tuesday 13:00 - 17:00
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('dddd')} {startTime.format('LT')} -{' '}
							{endTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('dddd')}
							</a>&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>{' '}
							<span>-</span>{' '}
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				case StartEndPatterns.START_END: // Every week Tuesday to Wednesday
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.format('dddd')}{' '}
							{I18n.t(__T('js.task.recur.to'))} {endDate.format('dddd')}{' '}
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('dddd')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.to')} />&nbsp;
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.format('dddd')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME: // Every week Tuesday 13:00 to Wednesday 17:00
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.format('dddd')} {startTime.format('LT')}{' '}
							{I18n.t(__T('js.task.recur.to'))} {endDate.format('dddd')}{' '}
							{endTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('dddd')}
							</a>&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.to')} />&nbsp;
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.format('dddd')}
							</a>&nbsp;
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				default:
					// Every week on Tuesday Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('dddd')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('dddd')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
			}

		case RecurTypes.MONTHLY:
			switch (pattern) {
				// StartEndPatterns.START is default
				case StartEndPatterns.START_TIME: // Every month 1 at 13:00 Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.date()} {I18n.t(__T('js.task.recur.at'))}{' '}
							{startTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.date()}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.at')} />&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_SAME: // Every month 1 Change End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))} {startDate.date()}{' '}
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.date()}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {changeEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME_SAME: // Every month 1 13:00 - 14:00
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.date()} {startTime.format('LT')} -{' '}
							{endTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.date()}
							</a>&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>{' '}
							<span>-</span>{' '}
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				case StartEndPatterns.START_END: // Every month 1 to 2
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.date()} {I18n.t(__T('js.task.recur.to'))}{' '}
							{endDate.date()} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.date()}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.to')} />&nbsp;
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.date()}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME: // Every month 1 13:00 to 2 14:00
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.date()} {startTime.format('LT')}{' '}
							{I18n.t(__T('js.task.recur.to'))} {endDate.date()}{' '}
							{endTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.date()}
							</a>&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.to')} />&nbsp;
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.date()}
							</a>&nbsp;
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				default:
					// Every month 1 Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.date()} {recurEndDatePrefix}{' '}
							{recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.date()}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
			}

		case RecurTypes.YEARLY:
			switch (pattern) {
				// StartEndPatterns.START is default
				case StartEndPatterns.START_TIME: // Every year on 1 Jan at 13:00 Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('D MMM')} {I18n.t(__T('js.task.recur.at'))}{' '}
							{startTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('D MMM')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.at')} />&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_SAME: // Every year on 1 Jan Change End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('D MMM')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('D MMM')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {changeEndLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME_SAME: // Every year on 1 Jan 13:00 - 17:00
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('D MMM')} {startTime.format('LT')} <span>-</span>{' '}
							{endTime.format('LT')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('D MMM')}
							</a>&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>{' '}
							<span>-</span>{' '}
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				case StartEndPatterns.START_END: // Every year 1 Jan to 2 Jan
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.format('D MMM')}{' '}
							{I18n.t(__T('js.task.recur.to'))} {endDate.format('D MMM')}{' '}
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('D MMM')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.to')} />&nbsp;
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.format('D MMM')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				case StartEndPatterns.START_END_TIME: // Every year 1 Jan 13:00 to 2 Jan 17:00
					return plainText ? (
						<span>
							{recurTypeLabel} {startDate.format('D MMM')}{' '}
							{I18n.t(__T('js.task.recur.to'))} {endDate.format('D MMM')}{' '}
							{I18n.t(__T('js.task.recur.at'))} {startTime.format('LT')}{' '}
							<span>-</span> {endTime.format('LT')} {recurEndDatePrefix}{' '}
							{recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('D MMM')}
							</a>&nbsp;
							<a href={null} onClick={handleStartTimeClick} className={linkClassName}>
								{startTime.format('LT')}
							</a>&nbsp;
							<Translate value={__T('js.task.recur.to')} />&nbsp;
							<a href={null} onClick={handleEndDateClick} className={linkClassName}>
								{endDate.format('D MMM')}
							</a>&nbsp;
							<a href={null} onClick={handleEndTimeClick} className={linkClassName}>
								{endTime.format('LT')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel}
						</span>
					);
				default:
					// Every year on 1 Jan Set End...
					return plainText ? (
						<span>
							{recurTypeLabel} {I18n.t(__T('js.task.recur.on'))}{' '}
							{startDate.format('D MMM')} {recurEndDatePrefix} {recurEndDateLabel}
						</span>
					) : (
						<span className={classes.container}>
							{recurTypeLabel}&nbsp;
							<Translate value={__T('js.task.recur.on')} />&nbsp;
							<a href={null} onClick={handleStartDateClick} className={linkClassName}>
								{startDate.format('D MMM')}
							</a>&nbsp;
							{recurEndDatePrefix} {recurEndDateLabel} {setEndLabel}
						</span>
					);
			}

		default:
			console.error('Error in recurring summary: undefined recurring type');
			return null;
	}
};

export default RecurringDateTimeSummary;
