import React from 'react';
import PropTypes from 'prop-types';
import { ItemGroups } from '@hitask/constants/layout';
import { logRender } from '@hitask/utils/debug';
import AllMainItemGroup from '../../containers/ItemGroups/AllMainItemGroupContainer';
import AllCompletedItemGroup from '../../containers/ItemGroups/AllCompletedItemGroupContainer';
import NoItems from '../NoItems';
import ItemListBase from './ItemListBase';
import classes from './ItemList.scss';

class ItemListAll extends ItemListBase {
	constructor(props) {
		super(props);
		this.toggleAllMainItemGroup = this.toggleAllMainItemGroup.bind(this);
		this.toggleAllCompletedItemGroup = this.toggleAllCompletedItemGroup.bind(this);
	}

	toggleAllMainItemGroup() {
		this.props.toggleItemGroup(ItemGroups.ALL_MAIN);
	}

	toggleAllCompletedItemGroup() {
		this.props.toggleItemGroup(ItemGroups.ALL_COMPLETED);
	}

	render() {
		const { containerId, noItems } = this.props;
		logRender(`render ItemListAll (${containerId})`);
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
					<AllMainItemGroup
						containerId={containerId}
						getLastExpandedItemInfo={this.getLastExpandedItemInfo}
						setLastExpandedItemInfo={this.setLastExpandedItemInfo}
						toggleCollapse={this.toggleAllMainItemGroup}
						isOpen
					/>
					<AllCompletedItemGroup
						containerId={containerId}
						getLastExpandedItemInfo={this.getLastExpandedItemInfo}
						setLastExpandedItemInfo={this.setLastExpandedItemInfo}
						toggleCollapse={this.toggleAllCompletedItemGroup}
					/>
				</div>
			</div>
		);
	}
}

const { string, func, bool } = PropTypes;
ItemListAll.propTypes = {
	noItems: bool,
	containerId: string,
	toggleItemGroup: func.isRequired,
};

ItemListAll.defaultProps = {
	containerId: '',
	noItems: false,
};

export default ItemListAll;
