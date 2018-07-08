import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Tooltip2 } from '@hitask/blueprint-labs';
import { logRender } from '@hitask/utils/debug';

const ItemLastUpdateTime = ({ timeLastUpdate }) => {
	const timeLastUpdateMoment = moment(timeLastUpdate);
	const timeLastUpdateAbsolute = timeLastUpdateMoment.format('L LT');
	const timeLastUpdateRelative = timeLastUpdateMoment.fromNow();

	logRender('render ItemLastUpdateTime');
	return <Tooltip2 content={timeLastUpdateAbsolute}>{timeLastUpdateRelative}</Tooltip2>;
};

const { string } = PropTypes;
ItemLastUpdateTime.propTypes = {
	timeLastUpdate: string.isRequired,
};

export default ItemLastUpdateTime;
