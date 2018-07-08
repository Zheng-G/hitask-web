import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InputGroup } from '@hitask/blueprint-core';
import { FieldInputShape } from '../common';
import classes from './TextInput.scss';

class TextInput extends React.PureComponent {
	render() {
		const { input, className, inline, ...other } = this.props;
		return (
			<InputGroup
				{...input}
				onFocus={null}
				onBlur={null}
				className={classNames(className, {
					[classes.inline]: inline,
				})}
				{...other}
			/>
		);
	}
}

const { bool, string } = PropTypes;
TextInput.propTypes = {
	input: FieldInputShape.isRequired,
	className: string,
	inline: bool,
};

TextInput.defaultProps = {
	className: '',
	inline: false,
};

export default TextInput;
