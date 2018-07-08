import React from 'react';
import PropTypes from 'prop-types';
import classes from './IconRow.scss';

const IconRow = ({ name, icon }) => (
	<div className={classes.iconCell}>
		<div className={classes.icon}>{icon}</div>
		<div className={classes.icon}>{name}</div>
	</div>
);

const { string, element } = PropTypes;
IconRow.propTypes = {
	name: string.isRequired,
	icon: element.isRequired,
};

export default IconRow;
