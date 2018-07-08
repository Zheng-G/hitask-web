import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Classes as BpClasses } from '@hitask/blueprint-core';
import { SelectOptionShape } from '../FormControls/common';
import classes from './MenuItemRenderer.scss';

const MenuItemRenderer = ({ handleClick, item, isActive, isSelectable, isSelected, className }) => (
	<li key={item.id}>
		<a
			href={null}
			className={classNames(BpClasses.MENU_ITEM, className, {
				[BpClasses.ACTIVE]: isActive,
				[BpClasses.POPOVER_DISMISS]: item.popoverDismiss,
				[BpClasses.DISABLED]: item.disabled,
			})}
			onClick={item.disabled ? null : item.onClick ? item.onClick : handleClick}
		>
			{isSelectable && (
				<Icon iconName={isSelected ? 'tick' : 'blank'} className={classes.tickIcon} />
			)}
			{item.iconName && (
				<Icon
					iconName={item.iconName}
					className={classes.icon}
					style={{ color: item.iconColor }}
				/>
			)}
			{item.avatarUrl && (
				<img
					src={item.avatarUrl}
					alt=""
					className={classNames(classes.userAvatar, BpClasses.SKELETON)}
				/>
			)}
			{item.label}
		</a>
	</li>
);

const { func, bool, string } = PropTypes;
MenuItemRenderer.propTypes = {
	item: SelectOptionShape.isRequired,
	handleClick: func.isRequired,
	isActive: bool.isRequired,
	isSelectable: bool,
	isSelected: bool,
	className: string,
};

MenuItemRenderer.defaultProps = {
	className: '',
	isSelectable: false,
	isSelected: false,
};

export default MenuItemRenderer;
