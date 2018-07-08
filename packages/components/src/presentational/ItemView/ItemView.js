/* eslint react/prop-types:0 */
import React from 'react';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';
import { Translate, I18n } from 'react-redux-i18n';
import {
	Icon,
	Popover,
	Menu,
	MenuItem,
	Position,
	Classes as BpClasses,
} from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import { ItemCategories } from '@hitask/constants/item';
import ItemHistory from '../../containers/ItemHistoryContainer';
import ItemAttachments from '../../containers/ItemAttachmentsContainer';
import Button from '../Button';
import MarkdownText from '../MarkdownText';
import CommentForm from '../CommentForm';
import LiveUpdates from '../LiveUpdates';
import ItemLastUpdateTime from '../ItemLastUpdateTime';
import classes from './ItemView.scss';

const ItemOptions = {
	MODIFY: 'MODIFY',
	ADD_SUBITEM: 'ADD_SUBITEM',
	DELETE: 'DELETE',
};

const ItemOptionsConfig = {
	[ItemOptions.MODIFY]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[ItemOptions.ADD_SUBITEM]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: false,
	},
	[ItemOptions.DELETE]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
};

const isOptionsVisible = (optionName, category) => ItemOptionsConfig[optionName][category];

// <ItemView> is a dumb component.
// All propTypes and defaultProps are inherited from <Item>
class ItemView extends React.PureComponent {
	constructor(props) {
		super(props);
		this.toggleHistoryExpanded = this.toggleHistoryExpanded.bind(this);
		this.handleNewCommentSubmit = this.handleNewCommentSubmit.bind(this);
		this.state = {
			historyExpanded: false,
		};
	}

	loadHistoryDebounce = _debounce(this.props.loadHistory, 500);

	toggleHistoryExpanded(expanded) {
		this.setState({ historyExpanded: expanded });
		if (expanded) {
			this.loadHistoryDebounce();
		}
	}

	handleNewCommentSubmit(formValues) {
		const { handleNewCommentSubmit, selfId } = this.props;
		handleNewCommentSubmit({ message: formValues.comment, userId: selfId });
		this.toggleHistoryExpanded(true);
	}

	render() {
		const { id, message, category } = this.props;
		const { historyExpanded } = this.state;

		const permissions = this.props.permissions
			.split(',')
			.filter(str => !!str)
			.map((str, index) => {
				const perm = str.split('|');
				return {
					id: `${index}${perm[0]}`,
					name: perm[0],
					label: perm[1],
				};
			});

		logRender(`render ItemView #${id}`);
		return (
			<div className={classes.view}>
				<div
					className={classNames(classes.propertiesWrapper, {
						[classes.historyExpanded]: historyExpanded,
					})}
				>
					<div className={classes.actionsRow}>
						<span className={classes.lastUpdateLabel}>
							<span className={classes.propLabel}>
								{I18n.t(__T('js.task.last_modified'))}:
							</span>{' '}
							<LiveUpdates id="item-view-time-last-update">
								<ItemLastUpdateTime timeLastUpdate={this.props.timeLastUpdate} />
							</LiveUpdates>
						</span>
						{isOptionsVisible(ItemOptions.MODIFY, category) && (
							<Button
								text={I18n.t(__T('js.task.modify'))}
								onClick={this.props.handleModifyAction}
								semiMinimal
							/>
						)}
						<Popover popoverClassName={BpClasses.MINIMAL} position={Position.LEFT_TOP}>
							<Button iconName="more" title="More options" semiMinimal />
							<Menu>
								{isOptionsVisible(ItemOptions.ADD_SUBITEM, category) && (
									<MenuItem
										iconName="plus"
										text={I18n.t(__T('js.task.add_item'))}
										onClick={this.props.handleAddSubitemAction}
									/>
								)}
								{isOptionsVisible(ItemOptions.DELETE, category) && (
									<MenuItem
										iconName="trash"
										text={I18n.t(__T('js.task.delete_button'))}
										onClick={this.props.handleDeleteAction}
									/>
								)}
							</Menu>
						</Popover>
					</div>

					<ItemAttachments itemId={id} />

					{message && (
						<div className={classNames(classes.propRow, classes.itemDescription)}>
							<MarkdownText text={message} itemId={id} />
						</div>
					)}

					<div className={classes.propRow}>
						<Icon
							iconName={this.props.hasEveryonePermission ? 'unlock' : 'lock'}
							className={classNames(classes.propLabel, classes.permissionsContent)}
						/>
						{this.props.isPrivate ? (
							<Translate
								value={__T('js.task.private')}
								className={classes.permissionsContent}
							/>
						) : (
							<span
								className={classNames(
									classes.propContent,
									classes.permissionsContent
								)}
							>
								{permissions.map((perm, index) => (
									<span className={classes.propListUnit} key={perm.id}>
										{perm.name}: {perm.label}
										{index !== permissions.length - 1 ? ',' : null}
									</span>
								))}
							</span>
						)}
					</div>

					<ItemHistory
						itemId={id}
						isOpen={historyExpanded}
						toggleCollapse={this.toggleHistoryExpanded}
					/>
				</div>
				<CommentForm handleSubmit={this.handleNewCommentSubmit} />
			</div>
		);
	}
}

export default ItemView;
