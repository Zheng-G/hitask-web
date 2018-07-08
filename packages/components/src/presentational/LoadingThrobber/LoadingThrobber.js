import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import classes from './LoadingThrobber.scss';

const LoadingThrobber = ({ wrapped, className }) =>
	wrapped ? (
		<div className={classNames(classes.wrapper, className)}>
			<span data-loader="ball-fade">&nbsp;</span>
		</div>
	) : (
		<span data-loader="ball-fade">&nbsp;</span>
	);

const { bool, string } = PropTypes;
LoadingThrobber.propTypes = {
	wrapped: bool,
	className: string,
};

LoadingThrobber.defaultProps = {
	wrapped: true,
	className: '',
};

export default LoadingThrobber;
