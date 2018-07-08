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
import classes from './TagSearchInput.scss';

const ItemQueryList = BpQueryList.ofType();
const emptyFunc = () => {};

class TagSearchInput extends InputPopoverComponent {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			activeItem: '',
		};
		this.handleActiveItemChange = this.handleActiveItemChange.bind(this);
		this.renderQueryList = this.renderQueryList.bind(this);
		this.onItemSelect = this.onItemSelect.bind(this);
		this.getTargetKeyDownHandler = this.getTargetKeyDownHandler.bind(this);
		this.getTargetKeyUpHandler = this.getTargetKeyUpHandler.bind(this);
		this.resetValue = this.resetValue.bind(this);
		this.removeItem = this.removeItem.bind(this);
	}

	onItemSelect(item) {
		if (!item) return;
		const { closeOnSelect } = this.props;
		if (this.isItemSelected(item)) {
			this.removeItem(item);
		} else {
			this.addItem(item);
		}
		if (closeOnSelect) {
			this.closePopup();
		}
	}

	getAvailableItems(queryText = this.props.input.value.text) {
		const { items } = this.props;
		const matches = queryText.match(/#(\S*)/gm);
		if (!matches) return [];
		const queryTag = matches[0].replace('#', '');
		if (!queryTag) return items;
		return items.filter(item => item.toLowerCase().includes(queryTag.toLowerCase()));
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
			handleQueryListKeyUp(e);
		};
	}

	addItem(item) {
		const { input: { value, onChange } } = this.props;
		const matches = value.text.match(/#\S*/g);
		const newText = matches
			? matches.map(match => match.replace('#', '')).reduce((acc, tag) => {
					if (!item.includes(tag)) return acc;
					return acc.replace(new RegExp(`#${tag}\s*`, 'g'), ''); // eslint-disable-line no-useless-escape
			  }, value.text)
			: value.text;
		onChange({
			tags: value.tags.concat([item]),
			text: newText.trim(),
		});
	}

	removeItem(item) {
		const { input: { value, onChange } } = this.props;
		onChange({
			tags: value.tags.filter(val => val !== item),
			text: value.text,
		});
	}

	handleActiveItemChange(item) {
		this.setState({
			activeItem: item,
		});
	}

	handleInputChange(inputValue) {
		const { input: { value, onChange } } = this.props;
		this.togglePopupVisibility(this.getAvailableItems(inputValue));
		onChange({
			tags: value.tags,
			text: inputValue,
		});
	}

	isItemSelected(item) {
		const { input: { value } } = this.props;
		return value.tags.includes(item);
	}

	resetValue() {
		this.props.input.onChange({
			tags: [],
			text: '',
		});
		if (this.resetButton) {
			this.resetButton.blur();
		}
		this.props.onReset();
	}

	renderItems({ filteredItems, handleItemSelect, activeItem }) {
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
				isActive: item === activeItem,
				isSelectable: true,
				isSelected: this.isItemSelected(item),
				index,
			})
		);
	}

	renderQueryList(listProps) {
		const { input, meta, className, inputProps, popoverProps } = this.props;
		const { handleKeyDown, handleKeyUp } = listProps;
		const isEmpty = input.value.tags.length === 0 && !input.value.text;
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
					popoverProps.popoverClassName
				)}
				tetherOptions={{
					constraints: [{ attachment: 'together', to: 'window' }],
					...popoverProps.tetherOptions,
				}}
			>
				<TagInput
					input={{
						...input,
						value: input.value.tags,
						onChange: emptyFunc,
					}}
					meta={meta}
					onRemove={this.removeItem}
					className={classNames(classes.input, className)}
					inputProps={{
						...inputProps,
						value: input.value.text,
						onChange: e => this.handleInputChange(e.target.value),
						onFocus: this.maybeOpenPopup,
						onBlur: null,
						ref: this.refHandlers.input,
						placeholder: isEmpty ? inputProps.placeholder : '',
					}}
					onKeyDown={this.getTargetKeyDownHandler(handleKeyDown)}
					onKeyUp={this.getTargetKeyUpHandler(handleKeyUp)}
					rightElement={
						<Button
							iconName="delete"
							className={BpClasses.MINIMAL}
							elementRef={this.refHandlers.resetButton}
							onClick={this.resetValue}
						/>
					}
				/>
				<div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} role="list">
					<Menu ulRef={listProps.itemsParentRef}>{this.renderItems(listProps)}</Menu>
				</div>
			</Popover>
		);
	}

	render() {
		const { input, items, groupClassName } = this.props;
		return (
			<ControlGroup
				className={classNames(InputPopoverClasses.group, classes.group, groupClassName)}
			>
				<ItemQueryList
					items={items}
					onItemSelect={this.onItemSelect}
					renderer={this.renderQueryList}
					query={input.value.text}
					itemListPredicate={this.getAvailableItems}
					activeItem={this.state.activeItem}
					onActiveItemChange={this.handleActiveItemChange}
				/>
			</ControlGroup>
		);
	}
}

const { string, arrayOf, bool, oneOfType, object, func } = PropTypes;
TagSearchInput.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	items: arrayOf(string).isRequired,
	itemRenderer: func.isRequired,
	className: string,
	closeOnSelect: bool,
	inputProps: oneOfType([object]),
	popoverProps: oneOfType([object]),
	groupClassName: string,
	onReset: func,
};

TagSearchInput.defaultProps = {
	itemRenderer: MenuItemRenderer,
	className: '',
	closeOnSelect: true,
	inputProps: {},
	popoverProps: {},
	groupClassName: '',
	onReset: emptyFunc,
};

export default TagSearchInput;
