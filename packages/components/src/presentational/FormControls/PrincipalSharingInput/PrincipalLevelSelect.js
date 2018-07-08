import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Popover, Position, Menu, MenuItem, Classes as BpClasses } from '@hitask/blueprint-core';
import { Classes as BpLabsClasses } from '@hitask/blueprint-labs';
import { FieldInputShape } from '../common';
import classes from './PrincipalLevelSelect.scss';

const getLevelLabel = (levels, levelId) => {
	const target = levels.find(level => level.id === levelId);
	return target ? target.label : '';
};

class PrincipalLevelSelect extends React.PureComponent {
	render() {
		const {
			input: { value, onChange },
			id,
			label,
			avatarUrl,
			levels,
			disabled,
			popoverProps,
		} = this.props;
		return (
			<Popover
				key={id}
				autoFocus={false}
				enforceFocus={false}
				position={Position.BOTTOM_LEFT}
				{...popoverProps}
				isDisabled={disabled}
				popoverClassName={classNames(
					BpClasses.MINIMAL,
					BpLabsClasses.SELECT_POPOVER,
					popoverProps.popoverClassName
				)}
				tetherOptions={{
					constraints: [{ attachment: 'together', to: 'window' }],
					...popoverProps.tetherOptions,
				}}
			>
				<span className={classNames(classes.principal, { disabled })}>
					{avatarUrl && <img src={avatarUrl} alt="" className={classes.userAvatar} />}
					<span className={classes.label}>
						{label}: {getLevelLabel(levels, value)}
					</span>
				</span>
				<Menu>
					{levels.map(level => (
						<MenuItem
							key={level.id}
							text={level.label}
							iconName={value === level.id ? 'tick' : 'blank'}
							onClick={() => !disabled && onChange(level.id)}
						/>
					))}
				</Menu>
			</Popover>
		);
	}
}

const { string, object, arrayOf, shape, bool } = PropTypes;
PrincipalLevelSelect.propTypes = {
	input: FieldInputShape.isRequired,
	id: string.isRequired,
	label: string.isRequired,
	avatarUrl: string,
	disabled: bool,
	levels: arrayOf(object).isRequired,
	popoverProps: shape({}),
};

PrincipalLevelSelect.defaultProps = {
	popoverProps: {},
	avatarUrl: null,
	disabled: false,
};

export default PrincipalLevelSelect;
