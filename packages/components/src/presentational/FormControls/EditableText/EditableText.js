import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { EditableText as BpEditableText, Intent } from '@hitask/blueprint-core';
import { FieldInputShape, FieldMetaShape } from '../common';
import classes from './EditableText.scss';

class EditableText extends React.PureComponent {
	render() {
		const {
			input,
			meta: { touched, invalid },
			intent,
			textareaStyle,
			className,
			wrapperClassName,
			...other
		} = this.props;
		return (
			<div
				className={classNames(classes.container, wrapperClassName, {
					[classes.textareaStyle]: textareaStyle,
				})}
			>
				<BpEditableText
					{...input}
					intent={(touched && invalid && Intent.DANGER) || intent}
					className={classNames(className, classes.element, {
						'pt-editable-withborder': textareaStyle,
					})}
					{...other}
				/>
			</div>
		);
	}
}

const { number, bool, string } = PropTypes;
EditableText.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	intent: number,
	textareaStyle: bool,
	multiline: bool,
	className: string,
	wrapperClassName: string,
};

EditableText.defaultProps = {
	intent: Intent.NONE,
	textareaStyle: false,
	multiline: true,
	className: '',
	wrapperClassName: '',
};

export default EditableText;
