import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { ItemFormDefaultValues, MESSAGE_MAX_LENGTH } from '@hitask/constants/item';
import EditableText from '../FormControls/EditableText';
import { FieldInputShape, FieldMetaShape } from '../FormControls/common';
import classes from './ItemDescriptionInput.scss';

class ItemDescriptionInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: !!props.input.value,
		};
		this.openInput = this.openInput.bind(this);
		this.onInputConfirm = this.onInputConfirm.bind(this);
	}

	componentWillReceiveProps({ input }) {
		const hasValue = !!input.value;
		if (hasValue && !this.state.isOpen) {
			this.openInput();
		}
	}

	onInputConfirm(value) {
		const hasAnyValue = !!value.match(/./gm);
		if (!hasAnyValue) {
			this.props.input.onChange(ItemFormDefaultValues.message);
			this.closeInput();
		}
	}

	openInput() {
		this.setState({
			isOpen: true,
		});
	}

	closeInput() {
		this.setState({
			isOpen: false,
		});
	}

	render() {
		const { input, meta } = this.props;
		// TODO: localize closed label
		return this.state.isOpen ? (
			<EditableText
				input={input}
				meta={meta}
				className={classes.description}
				placeholder={I18n.t(__T('js.task.message_empty'))}
				minLines={2}
				maxLines={4}
				maxLength={MESSAGE_MAX_LENGTH}
				textareaStyle
				onConfirm={this.onInputConfirm}
			/>
		) : (
			<a href={null} onClick={this.openInput} className={classes.button}>
				+ Add Description
			</a>
		);
	}
}

ItemDescriptionInput.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
};

export default ItemDescriptionInput;
