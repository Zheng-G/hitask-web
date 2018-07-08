import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Classes as BpClasses } from '@hitask/blueprint-core';
import { Select as BpSelect } from '@hitask/blueprint-labs';
import MenuItemRenderer from '../../MenuItemRenderer';
import { FieldInputShape, SelectOptionShape } from '../common';
import classes from './Select.scss';

const ItemSelect = BpSelect.ofType();

const getLabelById = (items, id) => {
	const item = items.find(it => it.id === id);
	if (!item) {
		console.error(`Wrong Select value: item with id ${id} not found`);
		return '';
	}
	return item.label;
};

class Select extends React.PureComponent {
	render() {
		const { input, items, itemRenderer, useObjAsValue, popoverProps, ...other } = this.props;
		return (
			<ItemSelect
				{...other}
				itemRenderer={itemRenderer}
				onItemSelect={item => {
					if (!item.onClick) {
						input.onChange(useObjAsValue ? item : item.id);
					}
				}}
				items={items}
				popoverProps={{
					...popoverProps,
					popoverClassName: classNames(BpClasses.MINIMAL, popoverProps.popoverClassName),
					tetherOptions: {
						constraints: [{ attachment: 'together', to: 'window' }],
						...popoverProps.tetherOptions,
					},
				}}
			>
				<Button
					text={useObjAsValue ? input.value.label : getLabelById(items, input.value)}
					className={classes.button}
					rightIconName="double-caret-vertical"
					disabled={!items.length}
				/>
			</ItemSelect>
		);
	}
}

const { func, bool, arrayOf, oneOfType, object } = PropTypes;
Select.propTypes = {
	input: FieldInputShape.isRequired,
	items: arrayOf(SelectOptionShape).isRequired,
	itemRenderer: func,
	useObjAsValue: bool,
	filterable: bool,
	popoverProps: oneOfType([object]),
};

Select.defaultProps = {
	itemRenderer: MenuItemRenderer,
	useObjAsValue: false,
	popoverProps: {},
	filterable: false,
};

export default Select;
