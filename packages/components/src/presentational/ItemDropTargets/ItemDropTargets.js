import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import classes from './ItemDropTargets.scss';

const ItemDropTargets = ({
	connectItemBeforeReorderDropTarget,
	connectItemAfterReorderDropTarget,
	showBeforeDropTarget,
	showAfterDropTarget,
	isOverBefore,
	isOverAfter,
}) => (
	<div
		className={classNames(classes.dropWrapper, {
			hidden: !(showBeforeDropTarget || showAfterDropTarget),
			[classes.isOverBefore]: isOverBefore,
			[classes.isOverAfter]: isOverAfter,
		})}
	>
		{connectItemBeforeReorderDropTarget(<div className={classes.beforeDropContainer} />)}
		<div className={classes.intoDropContainer} />
		{connectItemAfterReorderDropTarget(<div className={classes.afterDropContainer} />)}
	</div>
);

const { func, bool } = PropTypes;
ItemDropTargets.propTypes = {
	connectItemBeforeReorderDropTarget: func,
	connectItemAfterReorderDropTarget: func,
	showBeforeDropTarget: bool,
	showAfterDropTarget: bool,
	isOverBefore: bool,
	isOverAfter: bool,
};

ItemDropTargets.defaultProps = {
	connectItemBeforeReorderDropTarget: content => content,
	connectItemAfterReorderDropTarget: content => content,
	showBeforeDropTarget: false,
	showAfterDropTarget: false,
	isOverBefore: false,
	isOverAfter: false,
};

export default ItemDropTargets;
