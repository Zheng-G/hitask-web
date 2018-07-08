import React from 'react';
import PropTypes from 'prop-types';
import { TagInput as BpTagInput } from '@hitask/blueprint-labs';
import { KeyCodes } from '@hitask/constants/global';
import { FieldInputShape } from '../common';

class TagInput extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			query: '',
		};
		this.onKeyDownHandle = this.onKeyDownHandle.bind(this);
		this.onKeyUpHandle = this.onKeyUpHandle.bind(this);
		this.onChangeHandle = this.onChangeHandle.bind(this);
		this.handleInputBlur = this.handleInputBlur.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	onChangeHandle(values) {
		const set = new Set(values);
		this.props.input.onChange([...set]);
		this.setState({
			query: '',
		});
	}

	onKeyDownHandle(e) {
		const { input: { value }, onKeyDown } = this.props;
		if (e.which === KeyCodes.COMMA) {
			this.onChangeHandle([...value, e.target.value.trim()]);
			e.preventDefault();
		}
		onKeyDown(e);
	}

	onKeyUpHandle(e) {
		this.props.onKeyUp(e);
	}

	addItem(item) {
		if (!item) return;
		const { input: { value: values } } = this.props;
		this.onChangeHandle(values.concat([item]));
	}

	handleInputBlur(e) {
		requestAnimationFrame(() => {
			const activeEl = document.activeElement;
			const childEl = activeEl && activeEl.children[0];
			if (
				activeEl &&
				activeEl.classList.contains('pt-overlay-content') &&
				childEl &&
				childEl.classList.contains('tag-input-suggest-popover')
			) {
				return; // Don't add tag if TagInput dropdown was clicked
			}
			const { inputProps: { onBlur } } = this.props;
			const { query } = this.state;
			this.addItem(query);
			if (onBlur) {
				onBlur(e);
			}
		});
	}

	handleInputChange(e) {
		const { inputProps: { onChange } } = this.props;
		this.setState({
			query: e.target.value,
		});
		if (onChange) {
			onChange(e);
		}
	}

	render() {
		const {
			input: { value, onChange, ...restInputs },
			inputProps,
			onKeyDown,
			onKeyUp, // destruct this to not include to rest
			...rest
		} = this.props;
		return (
			<BpTagInput
				{...restInputs}
				{...rest}
				values={value}
				onChange={this.onChangeHandle}
				inputProps={{
					value: this.state.query,
					...inputProps,
					onChange: this.handleInputChange,
					onBlur: this.handleInputBlur,
					onKeyDown: this.onKeyDownHandle,
					onKeyUp: this.onKeyUpHandle,
				}}
			/>
		);
	}
}

const { func, shape } = PropTypes;
TagInput.propTypes = {
	input: FieldInputShape.isRequired,
	inputProps: shape({}),
	onKeyDown: func,
	onKeyUp: func,
};

const emptyFunc = () => {};
TagInput.defaultProps = {
	inputProps: {},
	onKeyDown: emptyFunc,
	onKeyUp: emptyFunc,
};

export default TagInput;
