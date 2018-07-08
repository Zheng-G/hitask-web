import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ItemListTask from '@hitask/icons/ItemListTask.svg';
import TaskCompleted from '@hitask/icons/TaskCompleted.svg';
import { FieldInputShape } from '../common';
import classes from './CompleteCheckbox.scss';

class CompleteCheckbox extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onClick = e => e.stopPropagation();

	onChange() {
		const { input: { value: checked, onChange }, disabled } = this.props;
		if (disabled) return;
		// if (this.state.clicked) return; // Ignore clicks while item is completing
		// if (!ignored) {
		// 	this.setState(prevState => ({ clicked: !prevState.clicked }));
		// }
		onChange(!checked);
	}

	renderIcon() {
		const { input: { value: checked }, disabled } = this.props;
		// Need to add original class from svg because svgLoader will overwrite it
		const className = classNames('icon-item-list-task', classes.icon, {
			disabled,
		});
		return checked ? (
			<TaskCompleted className={className} />
		) : (
			<ItemListTask className={className} />
		);
	}

	render() {
		const { input, disabled, id } = this.props;
		return (
			<label
				className={classNames(classes.wrapper, this.props.className)}
				htmlFor={id}
				onClick={this.onClick}
			>
				<input
					type="checkbox"
					className={classNames(classes.inputHidden, {
						disabled,
					})}
					{...input}
					id={id}
					checked={input.value}
					onChange={this.onChange}
				/>
				{this.renderIcon()}
			</label>
		);
	}
}

const { bool, string } = PropTypes;
CompleteCheckbox.propTypes = {
	input: FieldInputShape.isRequired,
	disabled: bool,
	className: string,
	id: string,
	ignored: bool,
};

CompleteCheckbox.defaultProps = {
	disabled: false,
	className: '',
	id: '',
	ignored: false,
};

export default CompleteCheckbox;
