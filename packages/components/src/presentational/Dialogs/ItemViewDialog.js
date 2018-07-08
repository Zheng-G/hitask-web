import React from 'react';
import PropTypes from 'prop-types';
import { logRender } from '@hitask/utils/debug';
import Dialog from '../Dialog';
import Item from '../../containers/ItemContainer';
import classes from './ItemViewDialog.scss';

const emptyFunc = () => {};

const ItemViewDialog = ({ isOpen, closeDialog, id }) => {
	logRender(`render ItemViewDialog ${id}`);
	return (
		<Dialog isOpen={isOpen} closeDialog={closeDialog} className={classes.dialog}>
			<Item
				modal
				id={id}
				isTopLevel
				index={0}
				getLastExpandedItemInfo={emptyFunc}
				setLastExpandedItemInfo={emptyFunc}
				closeDialog={closeDialog}
			/>
		</Dialog>
	);
};

const { bool, func, number } = PropTypes;
ItemViewDialog.propTypes = {
	isOpen: bool.isRequired,
	closeDialog: func.isRequired,
	id: number,
};

ItemViewDialog.defaultProps = {
	id: null,
};

export default ItemViewDialog;
