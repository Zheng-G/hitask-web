/* eslint function-paren-newline:0 */
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { DnDTypes } from '@hitask/constants/global';
import { ReorderListItemTypes } from '@hitask/constants/item';
import { changeItemPriority } from '@hitask/modules/items';
import ItemDropTargets from '../presentational/ItemDropTargets';

const mapActionCreators = {
	changeItemPriority,
};

const mapStateToProps = () => ({});

/**
 * Drop to insert dragged item before the target
 */
const ItemBeforeReorderDropTarget = {
	canDrop(dropTargetItem, monitor) {
		const dragSourceItem = monitor.getItem();
		return dropTargetItem.id !== dragSourceItem.id;
	},

	drop(dropTargetItem, monitor) {
		const dragSourceItem = monitor.getItem();
		dropTargetItem.changeItemPriority({
			sourceItemId: dragSourceItem.id,
			targetItemId: dropTargetItem.id,
			insertType: ReorderListItemTypes.BEFORE,
		});
	},
};

const collectItemBeforeReorderDropTarget = (connector, monitor) => ({
	connectItemBeforeReorderDropTarget: connector.dropTarget(),
	showDropTargets: !!monitor.getItemType(),
	showBeforeDropTarget: monitor.canDrop(),
	isOverBefore: monitor.isOver(),
});

/**
 * Drop to insert dragged item after the target
 */
const ItemAfterReorderDropTarget = {
	canDrop(dropTargetItem, monitor) {
		const dragSourceItem = monitor.getItem();
		return dropTargetItem.id !== dragSourceItem.id;
	},

	drop(dropTargetItem, monitor) {
		const dragSourceItem = monitor.getItem();
		dropTargetItem.changeItemPriority({
			sourceItemId: dragSourceItem.id,
			targetItemId: dropTargetItem.id,
			insertType: ReorderListItemTypes.AFTER,
		});
	},
};

const collectItemAfterReorderDropTarget = (connector, monitor) => ({
	connectItemAfterReorderDropTarget: connector.dropTarget(),
	showAfterDropTarget: monitor.canDrop(),
	isOverAfter: monitor.isOver(),
});

export default connect(mapStateToProps, mapActionCreators)(
	DropTarget(DnDTypes.LIST_ITEM, ItemBeforeReorderDropTarget, collectItemBeforeReorderDropTarget)(
		DropTarget(
			DnDTypes.LIST_ITEM,
			ItemAfterReorderDropTarget,
			collectItemAfterReorderDropTarget
		)(ItemDropTargets)
	)
);
