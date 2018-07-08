import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from '@hitask/blueprint-core';
import classNames from 'classnames';
import classes from './ItemHead.scss';

const ItemTitle = ({
	// Item API:
	title,
	unread,
	ellipsis,
	tags: tagsStr,
	onDoubleClick,
}) => {
	const haveTags = !!tagsStr;
	const tags = tagsStr.split(',');
	return (
		<div className={classes.itemTitleWrap}>
			<div className={classes.itemTitle}>
				<div
					className={classNames({
						[classes.unread]: unread,
					})}
					style={ellipsis}
				>
					<span onDoubleClick={onDoubleClick} role="presentation">
						{title}
					</span>
				</div>
			</div>

			{haveTags ? (
				<div className={classes.tagsWrap}>
					{tags.map(tag => (
						<Tag className={classes.tag} ellipsis={ellipsis} key={tag}>
							{tag}
						</Tag>
					))}
				</div>
			) : null}
		</div>
	);
};

const { string, any, number, objectOf, func } = PropTypes;

ItemTitle.propTypes = {
	title: string.isRequired,
	unread: number,
	ellipsis: objectOf(any),
	tags: string.isRequired,
	onDoubleClick: func.isRequired,
};

ItemTitle.defaultProps = {
	unread: null,
	ellipsis: null,
};

export default ItemTitle;
