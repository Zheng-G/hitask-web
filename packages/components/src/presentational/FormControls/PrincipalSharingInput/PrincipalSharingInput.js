import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Position, Button, ControlGroup, Classes as BpClasses, Keys } from '@hitask/blueprint-core';
import { MultiSelect as BpMultiSelect, Classes as BpLabsClasses } from '@hitask/blueprint-labs';
import InputPopoverComponent, { InputPopoverClasses } from '../InputPopoverComponent';
import MenuItemRenderer from '../../MenuItemRenderer';
import NoItemResults from '../NoItemResults';
import { FieldInputShape, FieldMetaShape } from '../common';
import PrincipalLevelSelect from './PrincipalLevelSelect';

import classes from './PrincipalSharingInput.scss';

const itemPredicateDefault = (query, item) =>
	item.label.toLowerCase().indexOf(query.toLowerCase()) >= 0;

const ItemsMultiSelect = BpMultiSelect.ofType();

class PrincipalSharingInput extends InputPopoverComponent {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
		this.renderItem = this.renderItem.bind(this);
		this.renderTag = this.renderTag.bind(this);
		this.handleItemSelect = this.handleItemSelect.bind(this);
		this.handleTagRemove = this.handleTagRemove.bind(this);
		this.modifyPrincipalPermission = this.modifyPrincipalPermission.bind(this);
		this.changeInputHandler = this.changeInputHandler.bind(this);
	}

	getPrincipalLevel(principal) {
		const { input: { value: values } } = this.props;
		const target = values.find(item => item.principal === principal);
		return target ? target.level : null;
	}

	getAvailableItems() {
		const { principals, selfId } = this.props;
		return principals.filter(item => item.id !== selfId);
	}

	getSelectedItems() {
		const { input: { value: values }, principals, selfId } = this.props;
		return values
			.filter(val => val.principal !== selfId)
			.map(val => principals.find(item => item.id === val.principal));
	}

	changeInputHandler(e) {
		const items = this.getAvailableItems();
		const filteredItems = items.filter(item => this.props.itemPredicate(e.target.value, item));
		this.togglePopupVisibility(filteredItems);
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

	renderTag(principal) {
		const { levels, principals, input, meta } = this.props;
		if (!principal) {
			if (!principals.length) return null; // Teammates and everyone group may not be loaded yet
			const inputName = `PrincipalSharingInput (${meta.form}/${input.name})`;
			console.error(`Wrong ${inputName} value: unacceptable principal ${principal}`);
			return null;
		}
		return (
			<PrincipalLevelSelect
				input={{
					value: this.getPrincipalLevel(principal.id),
					onChange: level => this.modifyPrincipalPermission(principal.id, level),
				}}
				id={principal.id}
				label={principal.label}
				avatarUrl={principal.avatarUrl}
				levels={levels}
				disabled={principal.disabled}
			/>
		);
	}

	isItemSelected(item) {
		const { input: { value: values } } = this.props;
		const target = values.find(val => val.principal === item.id);
		return !!target;
	}

	isPrivate() {
		const { input: { value: values }, selfId } = this.props;
		return values.filter(val => val.principal !== selfId).length === 0;
	}

	handleItemSelect(item) {
		if (this.isItemSelected(item)) {
			this.removeItem(item);
		} else {
			this.addItem(item);
		}
		if (this.props.closeOnSelect) {
			this.closePopupBlur();
		}
	}

	handleTagRemove(index) {
		const selectedItems = this.getSelectedItems();
		const item = selectedItems[index];
		if (item.disabled) return;
		this.removeItem(item);
	}

	addItem(item) {
		const { input: { value: values, onChange }, defaultLevel } = this.props;
		onChange(
			values.concat({
				principal: item.id,
				level: defaultLevel,
			})
		);
	}

	normalizeChangedValues(changedItem, newValues) {
		const { input: { value: values }, selfId, everyoneId } = this.props;
		const { principal } = changedItem;
		if (everyoneId && principal === everyoneId) {
			// User can't change personal permission by changing everyoneGroup perm level
			const selfValue = values.find(value => value.principal === selfId);
			const everyoneValue = values.find(value => value.principal === everyoneId);
			if (!selfValue && everyoneValue) {
				return newValues.concat([
					{
						principal: selfId,
						level: everyoneValue.level,
					},
				]);
			}
		}
		return newValues;
	}

	removeItem(item) {
		const { input: { value: values, onChange } } = this.props;
		const newValues = this.normalizeChangedValues(
			{
				principal: item.id,
				level: 0,
			},
			values.filter(val => val.principal !== item.id)
		);
		onChange(newValues);
	}

	modifyPrincipalPermission(principal, level) {
		const { input: { value: values, onChange } } = this.props;
		const newValues = this.normalizeChangedValues(
			{
				principal,
				level,
			},
			values.map(value => ({
				...value,
				level: value.principal === principal ? level : value.level,
			}))
		);
		onChange(newValues);
	}

	render() {
		const { popoverProps, tagInputProps, groupClassName, ...rest } = this.props;
		const isPrivate = this.isPrivate();
		return (
			<ControlGroup className={classNames(InputPopoverClasses.group, groupClassName)}>
				<ItemsMultiSelect
					noResults={<NoItemResults />}
					tagRenderer={this.renderTag}
					{...rest}
					items={this.getAvailableItems()}
					itemRenderer={this.renderItem}
					selectedItems={this.getSelectedItems()}
					onItemSelect={this.handleItemSelect}
					tagInputProps={{
						...tagInputProps,
						className: classNames(classes.tagInput, tagInputProps.className),
						placeholder: isPrivate ? 'Private' : tagInputProps.placeholder,
						inputProps: {
							placeholder: isPrivate ? 'Private' : tagInputProps.placeholder,
							onChange: this.changeInputHandler,
							onFocus: this.maybeOpenPopup,
							ref: this.refHandlers.input,
							className: classes.ghostInput,
						},
						tagProps: (
							tag /* Tag is React element <PrincipalLevelSelect> */,
							index
						) => {
							const { disabled } = tag.props;
							return {
								className: classNames(classes.tag, BpClasses.ROUND),
								onClick(e) {
									e.preventDefault();
									e.stopPropagation();
								},
								onRemove: disabled ? null : () => this.handleTagRemove(index),
							};
						},
						onKeyDown: (e, index) => {
							if (e.which === Keys.BACKSPACE && typeof index === 'number') {
								this.handleTagRemove(index);
							}
						},
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
				/>
				<Button
					iconName="caret-down"
					onClick={this.handleButtonClick}
					elementRef={this.refHandlers.button}
				/>
			</ControlGroup>
		);
	}
}

const { oneOfType, object, number, arrayOf, string, func, bool } = PropTypes;
PrincipalSharingInput.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	principals: arrayOf(object).isRequired,
	levels: arrayOf(object).isRequired,
	defaultLevel: number.isRequired,
	selfId: string.isRequired,
	everyoneId: string,
	itemRenderer: func,
	tagInputProps: oneOfType([object]),
	popoverProps: oneOfType([object]),
	closeOnSelect: bool,
	groupClassName: string,
	resetOnSelect: bool,
};

PrincipalSharingInput.defaultProps = {
	itemRenderer: MenuItemRenderer,
	itemPredicate: itemPredicateDefault,
	everyoneId: null,
	tagInputProps: {},
	popoverProps: {},
	closeOnSelect: true,
	groupClassName: '',
	resetOnSelect: true,
};

export default PrincipalSharingInput;
