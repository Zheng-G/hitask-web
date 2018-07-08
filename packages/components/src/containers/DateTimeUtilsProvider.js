import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firstDayOfWeekSelector, timeZoneSelector } from '@hitask/modules/user';
import * as DateTimeUtils from '@hitask/utils/DateTimeUtils';

const mapActionCreators = {};

const mapStateToProps = state => {
	const timeZone = timeZoneSelector(state);
	const firstDayOfWeek = firstDayOfWeekSelector(state);
	return {
		DateTimeUtils: {
			getSortedWeekDays: () => DateTimeUtils.getSortedWeekDays(firstDayOfWeek),
			getTimeZone: () => DateTimeUtils.getTimeZone(timeZone),
			string2moment: date => DateTimeUtils.string2moment(date, timeZone),
			moment2string: date => DateTimeUtils.moment2string(date),
			date2moment: date => DateTimeUtils.date2moment(date, timeZone),
			resetTime: date => DateTimeUtils.resetTime(date),
		},
	};
};

const { func, shape } = PropTypes;
export const DateTimeUtilsShape = shape({
	getSortedWeekDays: func.isRequired,
	getTimeZone: func.isRequired,
	string2moment: func.isRequired,
	moment2string: func.isRequired,
	date2moment: func.isRequired,
});

const DateTimeUtilsProvider = component => connect(mapStateToProps, mapActionCreators)(component);

export default DateTimeUtilsProvider;
