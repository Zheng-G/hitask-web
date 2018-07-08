import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Callout as BpCallout } from '@hitask/blueprint-core';
import classes from './Callout.scss';

const Callout = ({ className, ...otherProps }) => (
	<BpCallout className={classNames(classes.callout, className)} {...otherProps} />
);

const { string } = PropTypes;
Callout.propTypes = {
	className: string,
};

Callout.defaultProps = {
	className: '',
};

export default Callout;
