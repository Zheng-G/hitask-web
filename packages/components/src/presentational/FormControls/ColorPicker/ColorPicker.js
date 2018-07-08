import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Translate } from 'react-redux-i18n';
import { Popover, Position, Icon, Classes as BpClasses } from '@hitask/blueprint-core';
import { getColorById } from '@hitask/utils/helpers';
import { ItemColors } from '@hitask/constants/item';
import { FieldInputShape, FieldMetaShape } from '../common';
import classes from './ColorPicker.scss';

class ColorPicker extends React.PureComponent {
	render() {
		const { input, meta, popoverProps } = this.props;
		const selectedColor = getColorById(input.value);
		const noneSelected = selectedColor.id === ItemColors.NONE.id;
		return (
			<Popover
				position={Position.BOTTOM}
				{...popoverProps}
				popoverClassName={classNames(classes.popover, popoverProps.popoverClassName)}
			>
				<div className={classes.targetContainer}>
					<button
						className={classes.selected}
						style={{
							backgroundColor: selectedColor.value,
							borderColor: noneSelected ? null : 'transparent',
						}}
						type="button"
					/>
				</div>
				<div className={classes.content}>
					<Translate value={__T('js.task.color')} className={classes.title} />
					<div className={classes.optionsContainer}>
						{Object.keys(ItemColors)
							.map(key => ItemColors[key])
							.map(color => {
								const isNone = color.id === ItemColors.NONE.id;
								const isSelected = color.id === selectedColor.id;
								return (
									<label
										className={classNames(
											BpClasses.CONTROL,
											BpClasses.RADIO,
											BpClasses.POPOVER_DISMISS,
											classes.optionContainer
										)}
										htmlFor={`${meta.form}-${input.name}-${color.id}`}
										key={color.id}
									>
										<input
											{...input}
											type="radio"
											value={color.id}
											onChange={e =>
												input.onChange(parseInt(e.target.value, 10))
											}
											onFocus={null}
											onBlur={null}
											checked={input.value === color.id}
											id={`${meta.form}-${input.name}-${color.id}`}
										/>
										<span
											className={classes.optionIndicator}
											style={{
												backgroundColor: color.value,
											}}
										/>
										<Icon
											iconName={
												isNone ? 'cross' : isSelected ? 'tick' : 'blank'
											}
											className={classNames(classes.optionIcon, {
												[classes.noneIcon]: isNone,
												[classes.selectedIcon]: isSelected,
											})}
											size={20}
										/>
									</label>
								);
							})}
					</div>
				</div>
			</Popover>
		);
	}
}

const { oneOfType, object } = PropTypes;
ColorPicker.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	popoverProps: oneOfType([object]),
};

ColorPicker.defaultProps = {
	popoverProps: {},
};

export default ColorPicker;
