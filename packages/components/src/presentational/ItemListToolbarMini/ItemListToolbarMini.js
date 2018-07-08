import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Icon, Menu, MenuItem, PopoverInteractionKind, Position } from '@hitask/blueprint-core';
import { SortOrder } from '@hitask/constants/tabs';
import { logRender } from '@hitask/utils/debug';
import classes from './ItemListToolbarMini.scss';

const sortOrderList = Object.keys(SortOrder).map(key => SortOrder[key]);

const ItemListToolbarMini = ({
	currentSortOrder,
	changeSortOrder,
	centralHeaderVisible,
	hidden,
}) => {
	logRender('render ItemListToolbarMini');
	const orderMenuText = `${I18n.t(__T('hi.properties.sort'))} ${I18n.t(
		SortOrder[currentSortOrder].label
	)}`;
	return (
		<div
			className={classNames(classes.toolbar, {
				hidden,
				[classes.collapsedHeader]: !centralHeaderVisible,
			})}
		>
			<Menu className={classes.orderMenu}>
				<MenuItem
					text={orderMenuText}
					className={classes.orderMenuItem}
					popoverProps={{
						interactionKind: PopoverInteractionKind.CLICK,
						inline: false,
						position: Position.BOTTOM_LEFT,
						popoverClassName: classes.orderMenuPopover,
					}}
					label={<Icon iconName="caret-down" />}
				>
					{sortOrderList.map(sortOption => (
						<MenuItem
							key={sortOption.id}
							text={I18n.t(sortOption.label)}
							data-target={sortOption.id}
							className={classes.orderMenuSubitem}
							onClick={() => changeSortOrder(sortOption.id)}
							label={
								<Icon
									iconName={currentSortOrder === sortOption.id ? 'tick' : 'blank'}
								/>
							}
						/>
					))}
				</MenuItem>
			</Menu>
		</div>
	);
};

const { string, func, bool } = PropTypes;
ItemListToolbarMini.propTypes = {
	currentSortOrder: string,
	changeSortOrder: func.isRequired,
	centralHeaderVisible: bool,
	hidden: bool,
};

ItemListToolbarMini.defaultProps = {
	currentSortOrder: SortOrder.PRIORITY.id,
	centralHeaderVisible: true,
	hidden: false,
};

export default ItemListToolbarMini;
