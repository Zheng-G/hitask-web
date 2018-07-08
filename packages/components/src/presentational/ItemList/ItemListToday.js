import React from 'react';
import PropTypes from 'prop-types';
import { ItemGroups } from '@hitask/constants/layout';
import { logRender } from '@hitask/utils/debug';
import OverdueItemGroup from '../../containers/ItemGroups/OverdueItemGroupContainer';
import TodayMainItemGroup from '../../containers/ItemGroups/TodayMainItemGroupContainer';
import TodayCompletedItemGroup from '../../containers/ItemGroups/TodayCompletedItemGroupContainer';
import NoItems from '../NoItems';
import ItemListBase from './ItemListBase';
import classes from './ItemList.scss';

class ItemListToday extends ItemListBase {
	constructor(props) {
		super(props);
		this.toggleTodayOverdueItemGroup = this.toggleTodayOverdueItemGroup.bind(this);
		this.toggleTodayMainItemGroup = this.toggleTodayMainItemGroup.bind(this);
		this.toggleTodayCompletedItemGroup = this.toggleTodayCompletedItemGroup.bind(this);
	}

	toggleTodayOverdueItemGroup() {
		this.props.toggleItemGroup(ItemGroups.TODAY_OVERDUE);
	}

	toggleTodayMainItemGroup() {
		this.props.toggleItemGroup(ItemGroups.TODAY_MAIN);
	}

	toggleTodayCompletedItemGroup() {
		this.props.toggleItemGroup(ItemGroups.TODAY_COMPLETED);
	}

	render() {
		const { containerId, noItems } = this.props;
		logRender(`render ItemListToday (${containerId})`);
		return noItems ? (
			<NoItems />
		) : (
			<div
				className={classes.outterContainer}
				id={containerId}
				onWheel={e => this.handleWheelDebounced(e.deltaY)}
				ref={this.refHandlers.outterWrapNode}
			>
				<div ref={this.refHandlers.innerWrapNode} className={classes.innerContainer}>
					<OverdueItemGroup
						containerId={containerId}
						getLastExpandedItemInfo={this.getLastExpandedItemInfo}
						setLastExpandedItemInfo={this.setLastExpandedItemInfo}
						toggleCollapse={this.toggleTodayOverdueItemGroup}
					/>
					<TodayMainItemGroup
						containerId={containerId}
						getLastExpandedItemInfo={this.getLastExpandedItemInfo}
						setLastExpandedItemInfo={this.setLastExpandedItemInfo}
						toggleCollapse={this.toggleTodayMainItemGroup}
						isOpen
					/>
					<TodayCompletedItemGroup
						containerId={containerId}
						getLastExpandedItemInfo={this.getLastExpandedItemInfo}
						setLastExpandedItemInfo={this.setLastExpandedItemInfo}
						toggleCollapse={this.toggleTodayCompletedItemGroup}
					/>
				</div>
			</div>
		);
	}
}

const { string, func, bool } = PropTypes;
ItemListToday.propTypes = {
	noItems: bool,
	containerId: string,
	toggleItemGroup: func.isRequired,
};

ItemListToday.defaultProps = {
	containerId: '',
	noItems: false,
};

export default ItemListToday;
