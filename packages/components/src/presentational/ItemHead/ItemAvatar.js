import React from 'react';
import PropTypes from 'prop-types';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import classes from './ItemHead.scss';

const ItemAvatar = ({ avatar }) => (
	<div className={classes.itemAvatar}>
		<img src={avatar} alt="" className={BpClasses.SKELETON} />
	</div>
);

const { string } = PropTypes;
ItemAvatar.propTypes = {
	avatar: string.isRequired,
};

export default ItemAvatar;
