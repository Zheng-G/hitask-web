import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup as RadioGroupBlueprint } from '@hitask/blueprint-core';
import { FieldInputShape, FieldMetaShape } from '../common';

const renderOption = item => (
	<Radio
		label={item.label}
		value={item.value}
		key={item.value}
		className={item.inline ? 'pt-inline' : ''}
	/>
);

class RadioGroup extends React.PureComponent {
	render() {
		const { input, meta, items, ...other } = this.props;
		const isArray = typeof items === 'object' && items instanceof Array;
		return (
			<RadioGroupBlueprint {...input} selectedValue={input.value} {...other}>
				{isArray
					? items.map(renderOption)
					: Object.keys(items).map(key => renderOption(items[key]))}
			</RadioGroupBlueprint>
		);
	}
}

const { array, object, oneOfType } = PropTypes;

RadioGroup.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	items: oneOfType([array, object]).isRequired,
};

export default RadioGroup;
