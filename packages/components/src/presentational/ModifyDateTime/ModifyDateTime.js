import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logRender } from '@hitask/utils/debug';
import DateTimeInputs from '../DateTimeInputs';
import DateTimeSummary from '../DateTimeSummary';
import classes from './ModifyDateTime.scss';

class ModifyDateTime extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isStartVisible: false,
			isEndVisible: false,
		};
		this.toggleStartInputs = this.toggleStartInputs.bind(this);
		this.toggleEndInputs = this.toggleEndInputs.bind(this);
	}

	toggleStartInputs() {
		this.setState(state => ({
			...state,
			isStartVisible: !state.isStartVisible,
		}));
	}

	toggleEndInputs() {
		this.setState(state => ({
			...state,
			isEndVisible: !state.isEndVisible,
		}));
	}

	render() {
		const {
			startDate,
			startTime,
			endDate,
			endTime,
			category,
			recurType,
			recurInterval,
			recurEndDate,
			recurNeverEnd,
			openRecurringOverlay,
		} = this.props;
		const { isStartVisible, isEndVisible } = this.state;
		logRender('render ModifyDateTime');
		return (
			<div className={classes.modifyDateTime}>
				{!isStartVisible &&
					!isEndVisible && (
						<DateTimeSummary
							startDate={startDate}
							startTime={startTime}
							endDate={endDate}
							endTime={endTime}
							recurType={recurType}
							recurInterval={recurInterval}
							recurEndDate={recurEndDate}
							recurNeverEnd={recurNeverEnd}
							category={category}
							handleStartDateClick={this.toggleStartInputs}
							handleStartTimeClick={this.toggleStartInputs}
							handleEndDateClick={this.toggleEndInputs}
							handleEndTimeClick={this.toggleEndInputs}
							handleRepeatClick={openRecurringOverlay}
							linkClassName={classes.filledSummary}
						/>
					)}
				{isStartVisible && (
					<DateTimeInputs
						dateName="startDate"
						maxDate={this.props.endDate}
						timeName="startTime"
						checkboxName="isAllDay"
						isAllDay={this.props.isAllDay}
						onSubmit={this.toggleStartInputs}
					/>
				)}
				{isEndVisible && (
					<DateTimeInputs
						dateName="endDate"
						minDate={this.props.startDate}
						timeName="endTime"
						checkboxName="isAllDay"
						isAllDay={this.props.isAllDay}
						onSubmit={this.toggleEndInputs}
					/>
				)}
			</div>
		);
	}
}

const { bool, number, func, string } = PropTypes;
ModifyDateTime.propTypes = {
	startDate: string,
	startTime: string,
	endDate: string,
	endTime: string,
	isAllDay: bool,
	recurType: number.isRequired,
	recurInterval: number,
	recurEndDate: string,
	recurNeverEnd: bool.isRequired,
	category: number.isRequired,
	openRecurringOverlay: func.isRequired,
};

ModifyDateTime.defaultProps = {
	startDate: undefined,
	startTime: undefined,
	endDate: undefined,
	endTime: undefined,
	isAllDay: false,
	recurInterval: null,
	recurEndDate: null,
};

export default ModifyDateTime;
