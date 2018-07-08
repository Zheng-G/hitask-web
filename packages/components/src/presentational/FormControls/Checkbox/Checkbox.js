import React from 'react';
import { Checkbox as BpCheckbox } from '@hitask/blueprint-core';
import { FieldInputShape } from '../common';

class Checkbox extends React.PureComponent {
	render() {
		const { input, ...rest } = this.props;
		return (
			<BpCheckbox
				{...input}
				checked={input.value}
				onChange={e => input.onChange(e.target.checked)}
				{...rest}
			/>
		);
	}
}

Checkbox.propTypes = {
	input: FieldInputShape.isRequired,
};

export default Checkbox;
