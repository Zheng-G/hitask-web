import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Mock redux-form field wrapper for catalog
 */
class ReduxFormInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.defaultValue,
		};
		this.changeValue = this.changeValue.bind(this);
	}

	changeValue(output) {
		const { parse, onChange } = this.props;
		const target = output.target;
		this.setState({
			// 'output' can be a react event, check it:
			value: parse(target ? target.value : output),
		});
		if (onChange) {
			onChange(output);
		}
	}

	render() {
		const { children, format } = this.props;
		const inputProps = {
			input: {
				value: format(this.state.value),
				onChange: this.changeValue,
			},
			meta: {},
		};
		return React.cloneElement(children, inputProps);
	}
}

const emptyFunc = () => {};
const equalFunc = value => value;
const { any, func } = PropTypes;
ReduxFormInput.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	defaultValue: any, // eslint-disable-line react/forbid-prop-types
	format: func,
	parse: func,
	onChange: func,
};

ReduxFormInput.defaultProps = {
	defaultValue: undefined,
	format: equalFunc,
	parse: equalFunc,
	onChange: emptyFunc,
};

export default ReduxFormInput;
