import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import _isEqualWith from 'lodash/isEqualWith';
import _isEqual from 'lodash/isEqual';
import { I18n } from 'react-redux-i18n';
import { Icon } from '@hitask/blueprint-core';
import ReactBigCalendar from '@hitask/react-big-calendar';
import withDragAndDrop from '@hitask/react-big-calendar/lib/addons/dragAndDrop';
import '@hitask/react-big-calendar/lib/css/react-big-calendar.css';
import '@hitask/react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { logRender } from '@hitask/utils/debug';
import CalendarEvent from './BigCalendarEvent';
import classes from './BigCalendar.scss';

ReactBigCalendar.momentLocalizer(moment);
const DnDBigCalendar =
	__TARGET__ === 'ext-calendar'
		? withDragAndDrop(ReactBigCalendar)
		: withDragAndDrop(ReactBigCalendar, { backend: false });
const customComponents = {
	event: CalendarEvent,
};

/**
 * Compare two items collections
 * @function
 * @param {Array} currItems current items
 * @param {Array} nextItems next received items
 * @return {Boolean} true if items are different
 */
const calendarItemsChanged = (currItems, nextItems) => {
	if (currItems.length !== nextItems.length) return true;
	const changedItem = currItems.find((currItem, index) => !_isEqual(currItem, nextItems[index]));
	return !!changedItem;
};

const today = new Date();
class BigCalendar extends Component {
	constructor(props) {
		super(props);

		this.onEventDrop = this.onEventDrop.bind(this);
		this.moveEvent = this.moveEvent.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		if (
			_isEqualWith(this.props, nextProps, (currProp, nextProp, propKey) => {
				if (propKey === 'events' && calendarItemsChanged(currProp, nextProp)) return false;
				return undefined;
			})
		)
			return false;
		return true;
	}

	onEventDrop(event) {
		this.props.openItemView({ id: event.id });
	}

	getEvents() {
		return this.props.events.map(event => ({
			...event,
			start: event.start ? new Date(event.start) : event.start,
			end: event.start ? new Date(event.end) : event.end,
		}));
	}

	moveEvent({ event, start, end }) {
		const updatedEvent = { ...event, start, end };
		this.props.editItem(updatedEvent);
	}

	render() {
		logRender('render BigCalendar');
		return (
			<DnDBigCalendar
				selectable
				events={this.getEvents()}
				views={['day', 'week', 'month']}
				defaultView="month"
				defaultDate={today}
				className={classes.calendar}
				components={customComponents}
				messages={{
					previous: <Icon iconName="chevron-left" />,
					next: <Icon iconName="chevron-right" />,
					today: I18n.t(__T('js.calendar.today')),
					month: I18n.t(__T('js.calendar.month')),
					week: I18n.t(__T('js.calendar.week')),
					day: I18n.t(__T('js.calendar.day')),
				}}
				popup
				onSelectEvent={this.onEventDrop}
				onEventDrop={this.moveEvent}
			/>
		);
	}
}

const { object, arrayOf, func } = PropTypes;
BigCalendar.propTypes = {
	events: arrayOf(object).isRequired,
	openItemView: func.isRequired,
	editItem: func.isRequired,
};

export default BigCalendar;
