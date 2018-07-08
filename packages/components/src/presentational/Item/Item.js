import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { animateScroll } from 'react-scroll';
import { Collapse, Icon } from '@hitask/blueprint-core';
import { Priorities, RecurTypes, DateQuery } from '@hitask/constants/item';
import { logRender } from '@hitask/utils/debug';
import NewSubitemForm from '../../containers/NewSubitemFormContainer';
import ItemDropTargets from '../../containers/ItemDropTargetsContainer';
import ItemHead from '../ItemHead';
import ItemView from '../ItemView';
import classes from './Item.scss';

const AnimStates = {
	NONE: 'NONE',
	COLLAPSING: 'COLLAPSING',
	EXPANDING: 'EXPANDING',
};
const TRANSITION_TIME = 200;

class Item extends React.PureComponent {
	constructor(props) {
		super(props);
		this.expanded = props.expanded;
		this.animState = AnimStates.NONE;
		this.handleHeadClick = this.handleHeadClick.bind(this);
		this.handleModifyAction = this.handleModifyAction.bind(this);
		this.handleAddSubitemAction = this.handleAddSubitemAction.bind(this);
		this.handleDeleteAction = this.handleDeleteAction.bind(this);
		this.handleCompleteChange = this.handleCompleteChange.bind(this);
		this.scrollToItemTop = this.scrollToItemTop.bind(this);
		this.scrollToTopIfNeeded = this.scrollToTopIfNeeded.bind(this);
		this.getStyles = this.getStyles.bind(this);
	}

	componentDidMount() {
		if (this.props.expanded) {
			this.updateExpandedItemInfo();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.expanded !== this.expanded) {
			this.updateAnimState(nextProps.expanded);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timerId);
		clearTimeout(this.scrollToTopIfNeededTimer);
		this.props.setLastExpandedItemInfo(null);
	}

	getStyles() {
		const { expanded } = this.props;
		const enableEllipsis = !expanded;
		return {
			ellipsis: enableEllipsis
				? {
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
				  }
				: {
						overflow: 'hidden',
				  },
		};
	}

	refHandlers = {
		wrapperNode: ref => {
			this.wrapperNode = ref;
		},
	};

	isCompleteDisabled() {
		const { recurType, recurInstanceDate } = this.props;
		// Can't complete recurring items, if the instance is unknown
		if (recurType !== RecurTypes.NONE && recurInstanceDate !== DateQuery.TODAY) return true;
		return false;
	}

	handleCompleteChange(completed) {
		const {
			completeItem,
			forbidComplete,
			showConfirmationComplete,
			openConfirmationCompleteDialog,
			openCompleteRecurInfoAlert,
		} = this.props;
		if (forbidComplete) return;
		if (this.isCompleteDisabled()) {
			openCompleteRecurInfoAlert();
			return;
		}
		if (completed && showConfirmationComplete) {
			openConfirmationCompleteDialog();
		} else {
			completeItem(completed);
		}
	}

	updateExpandedItemInfo() {
		if (!this.wrapperNode) return;
		const { expanded, setLastExpandedItemInfo, index } = this.props;
		const { height } = this.wrapperNode.getBoundingClientRect();
		setLastExpandedItemInfo(expanded ? { height, index } : null);
	}

	updateAnimState(expanded) {
		this.expanded = expanded;
		this.animState = expanded ? AnimStates.EXPANDING : AnimStates.COLLAPSING;
		this.timerId = setTimeout(() => {
			this.updateExpandedItemInfo();
			this.animState = AnimStates.NONE;
		}, TRANSITION_TIME);
	}

	scrollToItemTop() {
		const { index, getLastExpandedItemInfo, containerId } = this.props;
		if (!this.wrapperNode) return;
		const lastExpandedItemInfo = getLastExpandedItemInfo();
		let scrollCompensate = 0;

		if (lastExpandedItemInfo) {
			const isNewExpandingLowerInTheList = index > lastExpandedItemInfo.index;
			const regularItemHeight = this.wrapperNode.getBoundingClientRect().height;
			if (lastExpandedItemInfo && isNewExpandingLowerInTheList) {
				scrollCompensate += lastExpandedItemInfo.height - regularItemHeight;
			}
		}

		const container = containerId && document.getElementById(containerId);
		if (container) {
			const containerTop = container.getBoundingClientRect().top;
			const wrapperNodeTop = this.wrapperNode.getBoundingClientRect().top;
			const scrollDest =
				wrapperNodeTop - containerTop + container.scrollTop - scrollCompensate;
			const scrollOpts = {
				containerId,
				duration: '250',
			};
			animateScroll.scrollTo(scrollDest, scrollOpts);
		}
	}

	scrollToTopIfNeeded() {
		if (!this.wrapperNode) return;
		const { containerId } = this.props;
		const container = containerId && document.getElementById(containerId);
		if (container) {
			const containerTop = container.getBoundingClientRect().top;
			const containerHeight = container.getBoundingClientRect().height;
			const wrapperNodeTop = this.wrapperNode.getBoundingClientRect().top;
			const wrapperNodeHeight = this.wrapperNode.getBoundingClientRect().height;
			const viewHeight = containerTop + containerHeight;
			if (wrapperNodeTop + wrapperNodeHeight >= viewHeight || wrapperNodeTop < containerTop)
				this.scrollToItemTop();
		}
	}

	handleHeadClick() {
		if (this.animState !== AnimStates.NONE) return; // Do not handle click during the animation

		const {
			expanded,
			toggleItemView,
			toggleHierarchy,
			isHierarchyOpened,
			setItemRead,
			unread,
			guid,
		} = this.props;
		toggleItemView();
		if ((!isHierarchyOpened && !expanded) || (isHierarchyOpened && expanded)) {
			toggleHierarchy();
		}
		if (!expanded) {
			// Scroll to opening item
			this.scrollToTopIfNeededTimer = setTimeout(
				this.scrollToTopIfNeeded,
				TRANSITION_TIME * 3 // Need more time to render ItemView
			);
		}
		if (unread) setItemRead(guid);
	}

	handleModifyAction() {
		const { handleModifyAction, forbidEdit, ownerName } = this.props;
		handleModifyAction({ forbidEdit, ownerName });
	}

	handleAddSubitemAction() {
		const { handleAddSubitemAction, forbidAttach, ownerName } = this.props;
		handleAddSubitemAction({ forbidAttach, ownerName });
	}

	handleDeleteAction() {
		const { handleDeleteAction, forbidDelete, ownerName } = this.props;
		handleDeleteAction({ forbidDelete, ownerName });
	}

	render() {
		const { id, expanded, children, isHierarchyOpened } = this.props;
		logRender(`render Item #${id}`);

		return this.props.connectDragPreview(
			<div
				key={id}
				data-test={`item-${id}`}
				className={classNames(classes.itemRoot, {
					[classes.isDragging]: this.props.isDragging,
				})}
			>
				<ItemDropTargets id={id} />
				{children && (
					<Icon
						iconName={isHierarchyOpened ? 'caret-down' : 'caret-right'}
						onClick={this.props.toggleHierarchy}
						className={classes.toggleHierarchyButton}
					/>
				)}
				<div
					className={classNames(classes.itemWrapper, {
						[classes.expanded]: expanded,
					})}
					ref={this.refHandlers.wrapperNode}
				>
					<ItemHead
						id={id}
						title={this.props.title}
						unread={this.props.unread}
						parentTitle={this.props.parentTitle}
						color={this.props.color}
						avatar={this.props.avatar}
						startDate={this.props.startDate}
						dueDate={this.props.dueDate}
						isOverdue={this.props.isOverdue}
						priority={this.props.priority}
						completed={this.props.completed}
						category={this.props.category}
						starred={this.props.starred}
						recurType={this.props.recurType}
						parentColorValue={this.props.parentColorValue}
						parentIsProject={this.props.parentIsProject}
						tags={this.props.tags}
						expanded={expanded}
						modal={this.props.modal}
						itemGroupId={this.props.itemGroupId}
						isTopLevel={this.props.isTopLevel}
						reorderEnabled={this.props.reorderEnabled}
						forbidComplete={this.props.forbidComplete}
						forbidDnD={this.props.forbidDnD}
						getStyles={this.getStyles}
						handleHeadClick={this.handleHeadClick}
						handleTitleDoubleClick={this.handleModifyAction}
						handleCompleteChange={this.handleCompleteChange}
						connectDragSource={this.props.connectDragSource}
					/>
					<Collapse isOpen={expanded} transitionDuration={TRANSITION_TIME}>
						{expanded && (
							<ItemView
								id={id}
								message={this.props.message}
								timeLastUpdate={this.props.timeLastUpdate}
								permissions={this.props.permissions}
								ownerName={this.props.ownerName}
								category={this.props.category}
								lastComment={this.props.lastComment}
								lastCommentId={this.props.lastCommentId}
								lastCommentUserId={this.props.lastCommentUserId}
								lastCommentCreateDate={this.props.lastCommentCreateDate}
								isPrivate={this.props.isPrivate}
								hasEveryonePermission={this.props.hasEveryonePermission}
								handleModifyAction={this.handleModifyAction}
								handleAddSubitemAction={this.handleAddSubitemAction}
								handleDeleteAction={this.handleDeleteAction}
								handleNewCommentSubmit={this.props.handleNewCommentSubmit}
								loadHistory={this.props.loadHistory}
								selfId={this.props.selfId}
							/>
						)}
					</Collapse>
				</div>
				{isHierarchyOpened && children}
				{this.props.isAddingSubitem && (
					<div className={classes.addSubitemContainer}>
						<NewSubitemForm
							parentItemId={id}
							closeForm={this.props.closeNewSubitemForm}
							scrollToParentTop={this.scrollToItemTop}
							forbidAttach={this.props.forbidAttach}
						/>
					</div>
				)}
			</div>,
			{
				captureDraggingState: true,
			}
		);
	}
}

const { string, number, bool, func, any } = PropTypes;
Item.propTypes = {
	title: string.isRequired,
	avatar: string,
	parentTitle: string,
	parentColorValue: string,
	showConfirmationComplete: bool,
	openConfirmationCompleteDialog: func.isRequired,
	openCompleteRecurInfoAlert: func.isRequired,
	startDate: string,
	dueDate: string,
	isOverdue: bool,
	recurType: number,
	timeLastUpdate: string.isRequired,
	starred: bool,
	expanded: bool,
	completed: bool,
	index: number.isRequired,
	id: number.isRequired,
	guid: string.isRequired,
	unread: number,
	setItemRead: func.isRequired,
	completeItem: func.isRequired,
	message: string,
	tags: string.isRequired, // Concatenated tags
	permissions: string.isRequired,
	ownerName: string,
	toggleItemView: func.isRequired,
	priority: number,
	toggleHierarchy: func.isRequired,
	isHierarchyOpened: bool,
	getLastExpandedItemInfo: func.isRequired,
	setLastExpandedItemInfo: func.isRequired,
	containerId: string,
	category: number.isRequired,
	children: any, // eslint-disable-line react/forbid-prop-types,
	color: string.isRequired,
	recurInstanceDate: string,
	isTopLevel: bool,
	parentIsProject: bool,
	reorderEnabled: bool,
	connectDragSource: func.isRequired,
	connectDragPreview: func.isRequired,
	isDragging: bool,
	// isEditing: bool,
	isAddingSubitem: bool,
	closeNewSubitemForm: func.isRequired,
	forbidComplete: bool.isRequired,
	forbidDnD: bool.isRequired,
	forbidAttach: bool.isRequired,
	forbidEdit: bool.isRequired,
	forbidDelete: bool.isRequired,
	lastComment: string,
	lastCommentId: number,
	lastCommentCreateDate: string,
	lastCommentUserId: number,
	handleModifyAction: func.isRequired,
	handleAddSubitemAction: func.isRequired,
	handleDeleteAction: func.isRequired,
	handleNewCommentSubmit: func.isRequired,
	loadHistory: func.isRequired,
	isPrivate: bool.isRequired,
	hasEveryonePermission: bool.isRequired,
	modal: bool,
	itemGroupId: string.isRequired,
	selfId: number.isRequired,
};

Item.defaultProps = {
	unread: null,
	avatar: null,
	parentTitle: null,
	parentColorValue: null,
	showConfirmationComplete: true,
	startDate: null,
	dueDate: null,
	isOverdue: false,
	starred: false,
	expanded: false,
	completed: false,
	recurType: RecurTypes.NONE,
	message: '',
	priority: Priorities.NORMAL.value,
	isHierarchyOpened: false,
	containerId: null,
	children: null,
	recurInstanceDate: null,
	isTopLevel: false,
	parentIsProject: false,
	reorderEnabled: false,
	isDragging: false,
	// isEditing: false,
	isAddingSubitem: false,
	ownerName: null,
	lastComment: null,
	lastCommentId: null,
	lastCommentCreateDate: null,
	lastCommentUserId: null,
	modal: false,
};

export default Item;
