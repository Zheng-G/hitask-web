import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Spinner as BpSpinner, Intent } from '@hitask/blueprint-core';
import classes from './Spinner.scss';

const Spinner = ({ wrapped, className, ...rest }) =>
	wrapped ? (
		<div className={classes.wrapper}>
			<BpSpinner
				intent={Intent.PRIMARY}
				{...rest}
				className={classNames(classes.spinner, className)}
			/>
		</div>
	) : (
		<BpSpinner
			intent={Intent.PRIMARY}
			{...rest}
			className={classNames(classes.spinner, className)}
		/>
	);

const { bool, string } = PropTypes;
Spinner.propTypes = {
	wrapped: bool,
	className: string,
};

Spinner.defaultProps = {
	wrapped: false,
	className: '',
};

export default Spinner;
