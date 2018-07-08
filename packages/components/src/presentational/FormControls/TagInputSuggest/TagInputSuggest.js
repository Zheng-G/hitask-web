import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
	Popover,
	Position,
	Button,
	Menu,
	Keys,
	ControlGroup,
	Classes as BpClasses,
} from '@hitask/blueprint-core';
import { QueryList as BpQueryList, Classes as BpLabsClasses } from '@hitask/blueprint-labs';
import MenuItemRenderer from '../../MenuItemRenderer';
import InputPopoverComponent, { InputPopoverClasses } from '../InputPopoverComponent';
import TagInput from '../TagInput';
import NoItemResults from '../NoItemResults';
import { FieldInputShape, FieldMetaShape } from '../common';

const ItemQueryList = BpQueryList.ofType();

class TagInputSuggest extends InputPopoverComponent {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			query: '',
			activeItem: '',
		};
		this.handleActiveItemChange = this.handleActiveItemChange.bind(this);
		this.handleTagInputChange = this.handleTagInputChange.bind(this);
		this.renderQueryList = this.renderQueryList.bind(this);
		this.onItemSelect = this.onItemSelect.bind(this);
		this.getTargetKeyDownHandler = this.getTargetKeyDownHandler.bind(this);
		this.getTargetKeyUpHandler = this.getTargetKeyUpHandler.bind(this);
	}

	onItemSelect(item) {
		const { input: { value: values, onChange }, closeOnSelect } = this.props;
		if (this.isItemSelected(item)) {
			// Remove item
			onChange(values.filter(val => val !== item));
		} else {
			// Add new item
			this.addItem(item);
		}
		if (closeOnSelect) {
			this.closePopup();
		}
	}

	addItem(item) {
		const { input: { value: values, onChange } } = this.props;
		const set = new Set(values);
		set.add(item);
		onChange([...set]);
		this.setState({
			query: '',
		});
	}

	getAvailableItems(query = this.state.query) {
		const { items } = this.props;
		return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
	}

	getTargetKeyDownHandler(handleQueryListKeyDown) {
		return e => {
			if (!this.state.isOpen) return;
			const { which } = e;
			if (which === Keys.ESCAPE || which === Keys.TAB) {
				this.input.blur();
				this.setState({
					isOpen: false,
				});
			}
			handleQueryListKeyDown(e);
		};
	}

	getTargetKeyUpHandler(handleQueryListKeyUp) {
		return e => {
			if (!this.state.isOpen) return;
			const { which } = e;
			if (which === Keys.ENTER) return;
			handleQueryListKeyUp(e);
		};
	}

	handleActiveItemChange(item) {
		this.setState({
			activeItem: item,
		});
	}

	handleInputChange(query) {
		this.togglePopupVisibility(this.getAvailableItems(query));
		this.setState({ query });
	}

	handleTagInputChange(value) {
		this.props.input.onChange(value);
		this.setState({
			query: '',
		});
	}

	isItemSelected(item) {
		const { input: { value } } = this.props;
		return value.includes(item);
	}

	renderItems({ filteredItems, handleItemSelect /* activeItem */ }) {
		if (!filteredItems.length) return <NoItemResults />;
		return filteredItems.map((item, index) =>
			this.props.itemRenderer({
				key: item,
				item: {
					id: index,
					label: item,
					iconName: 'tag',
				},
				handleClick: e => handleItemSelect(item, e),
				isSelectable: true,
				isSelected: this.isItemSelected(item),
				index,
			})
		);
	}

	renderQueryList(listProps) {
		const { input, meta, className, inputProps, popoverProps } = this.props;
		const { handleKeyDown, handleKeyUp } = listProps;
		const isEmpty = input.value.length === 0;
		return (
			<Popover
				autoFocus={false}
				enforceFocus={false}
				position={Position.BOTTOM_LEFT}
				{...popoverProps}
				isOpen={this.state.isOpen}
				onInteraction={this.handlePopoverInteraction}
				popoverClassName={classNames(
					BpClasses.MINIMAL,
					BpLabsClasses.SELECT_POPOVER,
					InputPopoverClasses.popover,
					popoverProps.popoverClassName,
					'tag-input-suggest-popover'
				)}
				tetherOptions={{
					constraints: [{ attachment: 'together', to: 'window' }],
					...popoverProps.tetherOptions,
				}}
			>
				<TagInput
					input={{
						...input,
						onChange: this.handleTagInputChange,
					}}
					meta={meta}
					className={className}
					inputProps={{
						...inputProps,
						value: this.state.query,
						onChange: e => this.handleInputChange(e.target.value),
						onFocus: this.maybeOpenPopup,
						ref: this.refHandlers.input,
						placeholder: isEmpty ? inputProps.placeholder : '',
					}}
					onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
					onKeyUp={this.getTargetKeyUpHandler(handleKeyUp)}
				/>
				<div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} role="list">
					<Menu ulRef={listProps.itemsParentRef}>{this.renderItems(listProps)}</Menu>
				</div>
			</Popover>
		);
	}

	render() {
		const { items, groupClassName } = this.props;
		return (
			<ControlGroup className={classNames(InputPopoverClasses.group, groupClassName)}>
				<ItemQueryList
					items={items}
					onItemSelect={this.onItemSelect}
					renderer={this.renderQueryList}
					query={this.state.query}
					itemListPredicate={this.getAvailableItems}
					activeItem={this.state.activeItem}
					onActiveItemChange={this.handleActiveItemChange}
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

const { string, arrayOf, bool, oneOfType, object, func } = PropTypes;
TagInputSuggest.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	items: arrayOf(string).isRequired,
	itemRenderer: func.isRequired,
	className: string,
	closeOnSelect: bool,
	inputProps: oneOfType([object]),
	popoverProps: oneOfType([object]),
	groupClassName: string,
};

TagInputSuggest.defaultProps = {
	itemRenderer: MenuItemRenderer,
	className: '',
	closeOnSelect: false,
	inputProps: {},
	popoverProps: {},
	groupClassName: '',
};

export default TagInputSuggest;
