import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Position, ControlGroup, Classes as BpClasses } from '@hitask/blueprint-core';
import { MultiSelect as BpMultiSelect, Classes as BpLabsClasses } from '@hitask/blueprint-labs';
import MenuItemRenderer from '../../MenuItemRenderer';
import InputPopoverComponent, { InputPopoverClasses } from '../InputPopoverComponent';
import NoItemResults from '../NoItemResults';
import { FieldInputShape, SelectOptionShape } from '../common';

const itemPredicateDefault = (query, item) =>
	item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0;

const tagRendererDefault = item => {
	if (!item) {
		console.error(`Wrong MultiSelect value: unacceptable item ${item}`);
		return null;
	}
	return item.label;
};

const ItemsMultiSelect = BpMultiSelect.ofType();

class MultiSelect extends InputPopoverComponent {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
		this.renderItem = this.renderItem.bind(this);
		this.handleItemSelect = this.handleItemSelect.bind(this);
		this.handleTagRemove = this.handleTagRemove.bind(this);
		this.changeInputHandler = this.changeInputHandler.bind(this);
	}

	getSelectedItems() {
		const { input: { value: values }, items } = this.props;
		return values.map(id => items.find(item => item.id === id));
	}

	getAvailableItems() {
		return this.props.items;
	}

	changeInputHandler(e) {
		const items = this.getAvailableItems();
		const filteredItems = items.filter(item => this.props.itemPredicate(e.target.value, item));
		this.togglePopupVisibility(filteredItems);
	}

	isItemSelected(item) {
		const { input: { value: selectedIds } } = this.props;
		return selectedIds.indexOf(item.id) !== -1;
	}

	selectItem(item) {
		const { input: { value, onChange } } = this.props;
		onChange(value.concat(item.id));
	}

	deselectItem(item) {
		const { input: { value, onChange } } = this.props;
		onChange(value.filter(id => id !== item.id));
	}

	handleItemSelect(item) {
		if (this.isItemSelected(item)) {
			this.deselectItem(item);
		} else {
			this.selectItem(item);
		}
		if (this.props.closeOnSelect) {
			this.closePopupBlur();
		}
	}

	handleTagRemove(tag) {
		const { items } = this.props;
		const clickedItem = items.find(item => item.label === tag);
		this.deselectItem(clickedItem);
	}

	renderItem = itemRendererProps => {
		const { itemRenderer } = this.props;
		const isSelected = this.isItemSelected(itemRendererProps.item);
		return itemRenderer({
			...itemRendererProps,
			isSelectable: true,
			isSelected,
		});
	};

	render() {
		const {
			items,
			placeholder,
			groupClassName,
			tagInputProps,
			popoverProps,
			itemRenderer,
			...rest
		} = this.props;
		return (
			<ControlGroup className={classNames(InputPopoverClasses.group, groupClassName)}>
				<ItemsMultiSelect
					noResults={<NoItemResults />}
					tagRenderer={this.props.tagRenderer}
					{...rest}
					items={items}
					itemRenderer={this.renderItem}
					selectedItems={this.getSelectedItems()}
					onItemSelect={this.handleItemSelect}
					tagInputProps={{
						...tagInputProps,
						onRemove: this.handleTagRemove,
						inputProps: {
							placeholder: tagInputProps.placeholder,
							onFocus: this.maybeOpenPopup,
							onChange: this.changeInputHandler,
							ref: this.refHandlers.input,
						},
					}}
					popoverProps={{
						position: Position.BOTTOM_LEFT,
						isDisabled: items.length === 0,
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
				/>
				<Button
					iconName="caret-down"
					elementRef={this.refHandlers.button}
					onClick={this.handleButtonClick}
					disabled={!items.length}
				/>
			</ControlGroup>
		);
	}
}

const { arrayOf, func, string, oneOfType, object, bool } = PropTypes;
MultiSelect.propTypes = {
	items: arrayOf(SelectOptionShape).isRequired,
	input: FieldInputShape.isRequired,
	tagInputProps: oneOfType([object]),
	popoverProps: oneOfType([object]),
	itemRenderer: func,
	tagRenderer: func,
	itemPredicate: func,
	placeholder: string,
	groupClassName: string,
	closeOnSelect: bool,
	resetOnSelect: bool,
};

MultiSelect.defaultProps = {
	itemRenderer: MenuItemRenderer,
	tagRenderer: tagRendererDefault,
	itemPredicate: itemPredicateDefault,
	tagInputProps: {},
	popoverProps: {},
	groupClassName: '',
	closeOnSelect: false,
	resetOnSelect: true,
};

export default MultiSelect;
