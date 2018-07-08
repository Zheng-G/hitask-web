import React from 'react';
import classNames from 'classnames';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import { ItemColors } from '@hitask/constants/item';
import { FieldInputShape, FieldMetaShape } from '../common';
import classes from './ColorSelect.scss';

class ColorSelect extends React.PureComponent {
	render() {
		const { input, meta } = this.props;
		return (
			<div className={classes.select}>
				<button
					type="button"
					className={classNames(
						BpClasses.BUTTON,
						BpClasses.MINIMAL,
						BpClasses.iconClass('cross'),
						classes.button,
						{
							[BpClasses.active]: input.value === ItemColors.NONE.id,
						}
					)}
					onClick={() => {
						input.onChange(0);
					}}
				/>
				<div
					className={classNames(BpClasses.INPUT_GROUP, {
						[classes.inputGroup]: true,
					})}
				>
					{Object.keys(ItemColors)
						.map(key => ItemColors[key])
						.map(color => (
							<label
								className={classNames(
									BpClasses.CONTROL,
									BpClasses.RADIO,
									BpClasses.INLINE,
									classes.control,
									{
										hidden: color.id === ItemColors.NONE.id,
									}
								)}
								htmlFor={`${meta.form}-${input.name}-${color.id}`}
								key={color.id}
							>
								<input
									{...input}
									onChange={e => input.onChange(parseInt(e.target.value, 10))}
									onFocus={null}
									onBlur={null}
									type="radio"
									value={color.id}
									id={`${meta.form}-${input.name}-${color.id}`}
									checked={input.value === color.id}
								/>
								<span
									className={BpClasses.CONTROL_INDICATOR}
									style={{
										backgroundColor: color.value,
										borderColor: color.value,
									}}
								/>
							</label>
						))}
				</div>
			</div>
		);
	}
}

ColorSelect.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
};

export default ColorSelect;
