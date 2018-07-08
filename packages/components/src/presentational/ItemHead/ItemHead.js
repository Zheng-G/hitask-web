/* eslint react/prop-types:0 */
import React from 'react';
import moment from 'moment-timezone';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Icon } from '@hitask/blueprint-core';
import { getPriorityByNumber } from '@hitask/utils/helpers';
import { logRender } from '@hitask/utils/debug';
import { ItemCategories, Priorities, ItemColors, RecurTypes } from '@hitask/constants/item';
import ItemEvent from '@hitask/icons/ItemEvent.svg';
import ItemEventCompleted from '@hitask/icons/ItemEventCompleted.svg';
import ItemFile from '@hitask/icons/ItemFile.svg';
import ItemNote from '@hitask/icons/ItemNote.svg';
import ItemStar from '@hitask/icons/ItemStar.svg';
import ItemPriorityHigh from '@hitask/icons/ItemPriorityHigh.svg';
import ItemPriorityLow from '@hitask/icons/ItemPriorityLow.svg';
import CompleteCheckbox from '../FormControls/CompleteCheckbox';
import ItemTitle from './ItemTitle';
import ItemProjectLabel from './ItemProjectLabel';
import ItemAvatar from './ItemAvatar';
import classes from './ItemHead.scss';

// <ItemHead> is a dumb component.
// All propTypes and defaultProps are inherited from <Item>
class ItemHead extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onIconClick = this.onIconClick.bind(this);
	}

	onIconClick(e) {
		const { handleCompleteChange, completed } = this.props;
		e.stopPropagation();
		handleCompleteChange(!completed);
	}

	render() {
		const {
			// Item API:
			id,
			unread,
			title,
			parentTitle,
			color,
			avatar,
			startDate,
			dueDate,
			isOverdue,
			priority,
			completed,
			category,
			starred,
			recurType,
			parentColorValue,
			parentIsProject,
			tags,
			// Logic:
			expanded,
			isTopLevel,
			reorderEnabled,
			forbidComplete,
			forbidDnD,
			modal,
			itemGroupId,
			// Functions:
			getStyles,
			handleHeadClick,
			handleTitleDoubleClick,
			handleCompleteChange,
			// DnD props:
			connectDragSource,
		} = this.props;
		const itemColor = ItemColors[color].value;
		const isInProjectGroup = itemGroupId.indexOf('PROJECT_') === 0;
		const isInAssigneeGroup = itemGroupId.indexOf('ASSIGN_') === 0;

		let leftElement;
		switch (category) {
			case ItemCategories.TASK:
				leftElement = (
					<CompleteCheckbox
						disabled={forbidComplete}
						input={{ value: completed, onChange: handleCompleteChange }}
						id={`complete-${id}`}
					/>
				);
				break;
			case ItemCategories.EVENT:
				leftElement = completed ? (
					<ItemEventCompleted width={16} height={16} onClick={this.onIconClick} />
				) : (
					<ItemEvent width={16} height={16} onClick={this.onIconClick} />
				);
				break;
			case ItemCategories.NOTE:
				leftElement = <ItemNote width={16} height={16} />;
				break;
			case ItemCategories.FILE:
				leftElement = <ItemFile width={16} height={16} />;
				break;
			default:
		}

		const starIcon = starred && (
			<ItemStar width={16} height={16} className={classes.itemStar} />
		);

		let priorityIcon;
		const priorityLevel = getPriorityByNumber(priority);
		switch (priorityLevel) {
			case Priorities.HIGH.id:
				priorityIcon = (
					<ItemPriorityHigh width={16} height={16} className={classes.itemPriorityIcon} />
				);
				break;
			case Priorities.LOW.id:
				priorityIcon = (
					<ItemPriorityLow width={16} height={16} className={classes.itemPriorityIcon} />
				);
				break;
			default:
		}

		let timeLabel;
		switch (recurType) {
			case RecurTypes.DAILY:
				timeLabel = I18n.t(__T('js.task.recurring_daily'));
				break;
			case RecurTypes.WEEKLY:
				timeLabel = I18n.t(__T('js.task.recurring_weekly'));
				break;
			case RecurTypes.MONTHLY:
				timeLabel = I18n.t(__T('js.task.recurring_monthly'));
				break;
			case RecurTypes.YEARLY:
				timeLabel = I18n.t(__T('js.task.recurring_yearly'));
				break;
			default:
				timeLabel = moment(dueDate || startDate).format('D MMM');
		}

		const { ellipsis } = getStyles();
		logRender(`render ItemHead #${id}`);

		return (
			<div
				className={classNames(classes.itemHead, {
					[classes.expanded]: expanded,
				})}
				onClick={handleHeadClick}
				role="presentation"
			>
				<div
					className={classes.itemLeftElemContainer}
					style={{ backgroundColor: itemColor }}
				>
					{leftElement}
				</div>
				{isTopLevel &&
					parentTitle &&
					!parentIsProject && (
						<span className={classes.parentTitle}>
							{parentTitle}
							<Icon iconName="caret-right" />
						</span>
					)}
				{starIcon}
				{priorityIcon}
				<ItemTitle
					title={title}
					ellipsis={ellipsis}
					unread={unread}
					tags={tags}
					onDoubleClick={handleTitleDoubleClick}
				/>
				{parentTitle &&
					parentIsProject &&
					!isInProjectGroup && (
						<ItemProjectLabel
							title={parentTitle}
							colorValue={parentColorValue}
							ellipsis={ellipsis}
						/>
					)}
				{avatar && !isInAssigneeGroup && <ItemAvatar avatar={avatar} />}
				{startDate && (
					<div
						className={classNames(classes.itemDate, {
							[classes.isOverdue]: isOverdue,
						})}
					>
						{timeLabel}
					</div>
				)}
				{!expanded &&
					reorderEnabled &&
					(forbidDnD ? (
						<div>
							<Icon
								iconName="drag-handle-vertical"
								className={classes.itemDragIconDisabled}
							/>
						</div>
					) : (
						connectDragSource(
							<div>
								<Icon
									iconName="drag-handle-vertical"
									className={classes.itemDragIconEnabled}
									title="Drag task"
								/>
							</div>
						)
					))}
				<Icon
					iconName={modal ? 'cross' : 'chevron-up'}
					className={classes.itemArrowUpIcon}
				/>
			</div>
		);
	}
}

export default ItemHead;
