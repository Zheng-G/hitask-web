import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Classes as BpClasses } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import classes from './ItemAttachment.scss';

class ItemAttachment extends PureComponent {
	render() {
		const { id, title, previewUrl, onTitleClick } = this.props;
		logRender(`render ItemAttachment #${id}`);
		return (
			<div className={classes.container}>
				<div className={classes.previewContainer}>
					{previewUrl ? (
						<img
							src={previewUrl}
							alt=""
							className={classNames(classes.previewImg, BpClasses.SKELETON)}
						/>
					) : (
						<Icon iconName="document" className={classes.previewIcon} />
					)}
				</div>
				<div className={classes.nameContainer}>
					<a href={null} onClick={onTitleClick}>
						{title}
					</a>
				</div>
			</div>
		);
	}
}

const { string, number, func } = PropTypes;
ItemAttachment.propTypes = {
	id: number.isRequired,
	onTitleClick: func.isRequired,
	title: string.isRequired,
	previewUrl: string,
};

ItemAttachment.defaultProps = {
	previewUrl: null,
};

export default ItemAttachment;
