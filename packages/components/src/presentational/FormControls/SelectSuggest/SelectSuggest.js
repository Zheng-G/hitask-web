import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Position, ControlGroup, Classes as BpClasses } from '@hitask/blueprint-core';
import { Suggest as BpSuggest, Classes as BpLabsClasses } from '@hitask/blueprint-labs';
import MenuItemRenderer from '../../MenuItemRenderer';
import InputPopoverComponent, { InputPopoverClasses } from '../InputPopoverComponent';
import NoItemResults from '../NoItemResults';
import { FieldInputShape, SelectOptionShape } from '../common';

const ItemSelectSuggest = BpSuggest.ofType();

class SelectSuggest extends InputPopoverComponent {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			query: '',
		};
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleItemSelect = this.handleItemSelect.bind(this);
	}

	getInputValue() {
		const { input: { value }, useObjAsValue } = this.props;
		const { query } = this.state;
		if (useObjAsValue) {
			return value.label || query;
		}
		if (value) return this.getLabelById(value);
		return query;
	}

	getAvailableItems(query = this.state.query) {
		const { items } = this.props;
		return items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
	}

	getLabelById(id) {
		const { items, input, meta = {} } = this.props;
		const item = items.find(it => it.id === id);
		if (!item) {
			const inputName = `SelectSuggest (${meta.form}/${input.name})`;
			console.error(`Wrong ${inputName} value: item with id ${id} not found`);
			return '';
		}
		return item.label;
	}

	handleInputChange({ target }) {
		this.togglePopupVisibility(this.getAvailableItems(target.value));
		const { input: { onChange }, useObjAsValue } = this.props;
		onChange(useObjAsValue ? {} : 0);
		this.setState({
			query: target.value,
		});
	}

	handleItemSelect(item) {
		const { input: { onChange }, closeOnSelect, useObjAsValue } = this.props;
		if (closeOnSelect) {
			this.closePopupBlur();
		}
		if (useObjAsValue) {
			onChange(item);
		} else {
			onChange(item.id);
		}
	}

	render() {
		const { items, inputProps, groupClassName, popoverProps, ...rest } = this.props;
		return (
			<ControlGroup className={classNames(InputPopoverClasses.group, groupClassName)}>
				<ItemSelectSuggest
					noResults={<NoItemResults />}
					inputValueRenderer={item => item.label}
					{...rest}
					inputProps={{
						...inputProps,
						value: this.getInputValue(),
						onChange: this.handleInputChange,
						onFocus: this.maybeOpenPopup,
						onBlur: this.handleInputBlur,
						inputRef: this.refHandlers.input,
					}}
					popoverProps={{
						position: Position.BOTTOM_LEFT,
						...popoverProps,
						isOpen: this.state.isOpen,
						onInteraction: this.handlePopoverInteraction,
						popoverClassName: classNames(
							BpClasses.MINIMAL,
							BpLabsClasses.SELECT_POPOVER,
							InputPopoverClasses.popover,
							popoverProps.popoverClassName
						),
						tetherOptions: {
							constraints: [{ attachment: 'together', to: 'window' }],
							...popoverProps.tetherOptions,
						},
					}}
					items={this.getAvailableItems()}
					onItemSelect={this.handleItemSelect}
				/>
				<Button
					iconName="caret-down"
					elementRef={this.refHandlers.button}
					onClick={this.handleButtonClick}
				/>
			</ControlGroup>
		);
	}
}

const { func, bool, arrayOf, oneOfType, object, string } = PropTypes;
SelectSuggest.propTypes = {
	input: FieldInputShape.isRequired,
	items: arrayOf(SelectOptionShape).isRequired,
	itemRenderer: func,
	useObjAsValue: bool,
	inputProps: oneOfType([object]),
	popoverProps: oneOfType([object]),
	closeOnSelect: bool,
	groupClassName: string,
};

SelectSuggest.defaultProps = {
	itemRenderer: MenuItemRenderer,
	useObjAsValue: false,
	inputProps: {},
	popoverProps: {},
	closeOnSelect: true,
	groupClassName: '',
};

export default SelectSuggest;
