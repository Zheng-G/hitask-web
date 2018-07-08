import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Alert as BpAlert } from '@hitask/blueprint-core';
import classes from './Alert.scss';

const Alert = ({ children, className, ...otherProps }) => (
	<BpAlert className={classNames(classes.alert, className)} {...otherProps}>
		{children}
	</BpAlert>
);

const { string, any } = PropTypes;
Alert.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	className: string,
};

Alert.defaultProps = {
	className: '',
};

export default Alert;
