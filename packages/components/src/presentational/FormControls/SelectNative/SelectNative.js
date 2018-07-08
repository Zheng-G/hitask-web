import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import { FieldInputShape, FieldMetaShape, SelectOptionShape } from '../common';

class SelectNative extends React.PureComponent {
	render() {
		const { input, meta, items, className, minimal, ...other } = this.props;
		return (
			<div
				className={classNames(BpClasses.SELECT, className, {
					[BpClasses.MINIMAL]: minimal,
				})}
			>
				<select
					{...input}
					onChange={e => input.onChange(parseInt(e.target.value, 10))}
					onBlur={null}
					{...other}
					className="full-width"
				>
					{items.map(({ id, label }) => (
						<option value={id} key={id}>
							{label}
						</option>
					))}
				</select>
			</div>
		);
	}
}

const { string, arrayOf, bool } = PropTypes;
SelectNative.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	items: arrayOf(SelectOptionShape).isRequired,
	className: string,
	minimal: bool,
};

SelectNative.defaultProps = {
	className: '',
	minimal: true,
};

export default SelectNative;
