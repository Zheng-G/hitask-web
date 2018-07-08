import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import _isEqualWith from 'lodash/isEqualWith';
// import _isEqual from 'lodash/isEqual';
import { logRender } from '@hitask/utils/debug';
import classes from './BigCalendar.scss';

class BigCalendarEvent extends PureComponent {
	// shouldComponentUpdate(nextProps) {
	// 	if (_isEqualWith(this.props, nextProps, (currProp, nextProp, propKey) => {
	// 		if (propKey === 'event' && _isEqual(currProp, nextProp)) return false;
	// 		return undefined;
	// 	})) return false;
	// 	return true;
	// }

	render() {
		const { title, event: { completed } } = this.props;
		logRender('render BigCalendarEvent');
		return (
			<div
				className={classNames(classes.event, {
					[classes.completedEvent]: completed,
				})}
			>
				<span className={classes.title}>{title}</span>
			</div>
		);
	}
}

const { string, shape } = PropTypes;
BigCalendarEvent.propTypes = {
	title: string.isRequired,
	event: shape({}).isRequired,
};

export default BigCalendarEvent;
