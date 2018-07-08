import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment-timezone';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import HistoryEditIcon from '@hitask/icons/item-view/history-edit.svg';
import { formatLineBrakes } from '@hitask/utils/textile';
import { logRender } from '@hitask/utils/debug';
import classes from './ItemHistoryUnit.scss';

const ItemHistoryUnit = ({
	value,
	time,
	userName,
	avatarUrl,
	isComment,
	// onDeleteClick,
	// canDelete,
}) => {
	const date = moment(time).format('L LT');
	const ago = moment(time).fromNow();
	logRender('render ItemHistoryUnit');
	return (
		<div
			className={classNames(classes.unit, {
				[classes.isEvent]: !isComment,
			})}
		>
			<div className={classes.content}>
				<img
					src={avatarUrl}
					alt={userName}
					className={classNames(BpClasses.SKELETON, classes.avatar)}
				/>
				<div className={classes.topRow}>
					<span className={classes.userName}>{userName}</span>
					<small className={classes.timeCreate}>{`${ago} (${date})`}</small>
				</div>
				{/* canDelete && (
					<Button
						iconName="cross"
						className={classNames(BpClasses.MINIMAL, classes.deleteButton)}
						onClick={onDeleteClick}
						title="Remove comment"
					/>
				) */}
			</div>
			<div
				className={classNames({
					[classes.commentText]: isComment,
					[classes.historyText]: !isComment,
				})}
			>
				{!isComment && <HistoryEditIcon />}
				<small
					className={classes.unitText}
					dangerouslySetInnerHTML={{ __html: formatLineBrakes(value) }} // eslint-disable-line react/no-danger
				/>
			</div>
		</div>
	);
};

const { string, bool } = PropTypes;
ItemHistoryUnit.propTypes = {
	value: string.isRequired,
	time: string.isRequired,
	userName: string.isRequired,
	avatarUrl: string.isRequired,
	// onDeleteClick: func.isRequired,
	// canDelete: bool.isRequired,
	isComment: bool.isRequired,
};

export default ItemHistoryUnit;
