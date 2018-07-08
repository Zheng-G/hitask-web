import React from 'react';
import PropTypes from 'prop-types';
import timer from '@hitask/utils/timer';
import { TickEvent } from '@hitask/constants/timer';

class LiveUpdates extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			currentTime: Date.now(),
		};
	}

	componentDidMount() {
		const { id, tickType, onUpdate } = this.props;
		timer.subscribe(id, tickType, now => {
			this.setState({
				currentTime: now.getTime(),
			});
			onUpdate(now);
		});
	}

	componentWillUnmount() {
		timer.removeTimer(this.props.id);
	}

	render() {
		const liveUpdateProps = {
			currentTime: this.state.currentTime,
		};
		return React.cloneElement(this.props.children, liveUpdateProps);
	}
}

const emptyFunc = () => {};
const { any, number, string, func } = PropTypes;
LiveUpdates.propTypes = {
	id: string.isRequired,
	tickType: number,
	onUpdate: func,
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
};

LiveUpdates.defaultProps = {
	tickType: TickEvent.MIN,
	onUpdate: emptyFunc,
};

export default LiveUpdates;
