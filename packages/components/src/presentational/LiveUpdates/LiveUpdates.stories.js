import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LiveUpdates from './LiveUpdates';

const Child = ({ currentTime }) => {
	return <h2>Current time: {moment(currentTime).format('LLL')}</h2>;
};

Child.propTypes = {
	currentTime: PropTypes.number.isRequired,
};

storiesOf('Simple/LiveUpdates', module).add('default', () => (
	<LiveUpdates id="test-live-update-1" onUpdate={action('updated')}>
		<Child />
	</LiveUpdates>
));
