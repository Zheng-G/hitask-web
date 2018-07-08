/* eslint function-paren-newline:0 */
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { DragSource } from 'react-dnd';
import { DnDTypes } from '@hitask/constants/global';
import { selfProfileSelector } from '@hitask/modules/auth';
import {
	completeItem,
	itemBasePropsSelector,
	setItemRead,
	deleteItem,
	addComment,
	loadHistory,
} from '@hitask/modules/items';
import {
	teammateSelector,
	showConfirmationCompleteSelector,
	teammatesProfilesSelector,
	everyoneIdSelector,
} from '@hitask/modules/user';
import { Overlays, openOverlay, openNoPermissionAlert } from '@hitask/modules/overlays';
import {
	toggleItemView,
	collapseAllItems,
	toggleNewSubitemForm,
	expandedItemSelector,
	itemWithSubitemFormSelector,
	sortOrderSelector,
} from '@hitask/modules/tabs';
import {
	toggleItemHierarchy,
	toggleCentralHeader,
	isItemHierarchyOpenedSelector,
} from '@hitask/modules/layout';
import { getAvatarUrl, isExtension } from '@hitask/utils/helpers';
import { SortOrder } from '@hitask/constants/tabs';
import Item from '../presentational/Item';

const itemPropKeys = [
	// API props:
	'title',
	'startDate',
	'dueDate',
	'timeLastUpdate',
	'starred',
	'completed',
	'id',
	'unread',
	'guid',
	'assignee',
	'message',
	'tags',
	'permissions',
	'priority',
	'category',
	'recurType',
	// Custom props:
	'isPrivate',
	'isOverdue',
	'hasEveryonePermission',
	'ownerName',
	'forbidComplete',
	'forbidDnD',
	'forbidAttach',
	'forbidEdit',
	'forbidDelete',
	'color',
	'parentTitle',
	'parentColorValue',
	'parentIsProject',
];

const mapActionCreators = (_, { id, recurInstanceDate, modal, closeDialog }) => {
	return dispatch => ({
		completeItem(completed) {
			dispatch(completeItem({ itemId: id, completed, recurInstanceDate }));
			dispatch(collapseAllItems({}));
		},
		openConfirmationCompleteDialog() {
			dispatch(
				openOverlay({
					name: Overlays.CONFIRM_ITEM_COMPLETE,
					props: {
						itemId: id,
						recurInstanceDate,
					},
				})
			);
		},
		openCompleteRecurInfoAlert() {
			dispatch(
				openOverlay({
					name: Overlays.INFO_MESSAGE,
					props: {
						title: I18n.t(__T('hi.common.not_permitted')),
						message: I18n.t(__T('js.project.complete_from_calendar_or_today')),
					},
				})
			);
		},
		toggleHierarchy() {
			dispatch(toggleItemHierarchy({ itemId: id }));
		},
		toggleItemView() {
			if (modal) {
				closeDialog();
				return;
			}
			dispatch(toggleItemView({ itemId: id }));
		},
		setItemRead(guid) {
			dispatch(setItemRead({ itemId: id, itemGuid: guid }));
		},
		closeNewSubitemForm() {
			dispatch(toggleNewSubitemForm({}));
		},
		handleModifyAction({ forbidEdit, ownerName }) {
			if (forbidEdit) {
				dispatch(
					openNoPermissionAlert({
						actionType: I18n.t(__T('js.common.modifyAction')),
						itemOwnerName: ownerName,
					})
				);
			} else {
				dispatch(openOverlay({ name: Overlays.EDIT_ITEM_FORM, props: { itemId: id } }));
				if (!isExtension) return;
				dispatch(toggleCentralHeader({ isOpen: false }));
			}
		},
		handleAddSubitemAction({ forbidAttach, ownerName }) {
			if (forbidAttach) {
				dispatch(
					openNoPermissionAlert({
						actionType: I18n.t(__T('js.common.addSubAction')),
						itemOwnerName: ownerName,
					})
				);
			} else {
				dispatch(toggleNewSubitemForm({ itemId: id }));
			}
		},
		handleDeleteAction({ forbidDelete, ownerName }) {
			if (forbidDelete) {
				dispatch(
					openNoPermissionAlert({
						actionType: I18n.t(__T('js.common.deleteAction')),
						itemOwnerName: ownerName,
					})
				);
			} else {
				dispatch(deleteItem(id));
			}
		},
		handleNewCommentSubmit({ message, userId }) {
			return dispatch(addComment({ itemId: id, userId, message }));
		},
		loadHistory() {
			return dispatch(loadHistory({ itemId: id }));
		},
	});
};

const mapStateToPropsFactory = (initState, { id, recurInstanceDate, modal }) => {
	return state => {
		const { id: selfId, pictureHash: selfPictureHash } = selfProfileSelector(state);
		const everyoneId = everyoneIdSelector(state);
		const teammatesNames = teammatesProfilesSelector(state);
		const item = itemBasePropsSelector(state, id, itemPropKeys, {
			recurInstanceDate,
			selfId,
			everyoneId,
			teammatesNames,
		});
		if (item.assignee) {
			let pictureHash;
			if (item.assignee === selfId) {
				pictureHash = selfPictureHash;
			} else {
				const assignee = teammateSelector(state, item.assignee);
				pictureHash = assignee && assignee.pictureHash;
			}
			if (pictureHash) {
				item.avatar = getAvatarUrl(pictureHash, 22);
			}
		}
		return {
			...item,
			isHierarchyOpened: isItemHierarchyOpenedSelector(state, id),
			showConfirmationComplete: showConfirmationCompleteSelector(state),
			expanded: modal || expandedItemSelector(state) === id,
			isAddingSubitem: itemWithSubitemFormSelector(state) === id,
			reorderEnabled: sortOrderSelector(state) === SortOrder.PRIORITY.id,
			selfId,
		};
	};
};

const ItemDragSource = {
	beginDrag({ id, priority }) {
		return { id, priority };
	},
};

const collectItemDragSource = (connector, monitor) => ({
	connectDragSource: connector.dragSource(),
	connectDragPreview: connector.dragPreview(),
	isDragging: monitor.isDragging(),
});

export default DragSource(DnDTypes.LIST_ITEM, ItemDragSource, collectItemDragSource)(
	connect(mapStateToPropsFactory, mapActionCreators)(Item)
);
