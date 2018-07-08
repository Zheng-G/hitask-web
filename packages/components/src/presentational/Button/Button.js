import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button as BpButton, Classes as BpClasses } from '@hitask/blueprint-core';
import classes from './Button.scss';

const Button = ({ className, minimal, semiMinimal, ...rest }) => (
	<BpButton
		{...rest}
		className={classNames(className, {
			[BpClasses.MINIMAL]: minimal || semiMinimal,
			[classes.semiMinimal]: semiMinimal,
		})}
	/>
);

const { string, bool } = PropTypes;
Button.propTypes = {
	className: string,
	minimal: bool,
	semiMinimal: bool,
};

Button.defaultProps = {
	className: '',
	minimal: false,
	semiMinimal: false,
};

export default Button;
