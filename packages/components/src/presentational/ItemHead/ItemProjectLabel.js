import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@hitask/blueprint-core';
import classes from './ItemHead.scss';

const ItemProjectLabel = ({ title, colorValue, ellipsis }) => (
	<div className={classes.itemProject}>
		<Icon
			iconName="folder-close"
			className={classes.itemProjectIcon}
			style={{ color: colorValue }}
		/>
		<div className={classes.itemProjectTitle}>
			<div style={ellipsis}>{title}</div>
		</div>
	</div>
);

const { string, objectOf, any } = PropTypes;
ItemProjectLabel.propTypes = {
	title: string,
	colorValue: string,
	ellipsis: objectOf(any),
};

ItemProjectLabel.defaultProps = {
	title: '',
	colorValue: null,
	ellipsis: null,
};

export default ItemProjectLabel;
