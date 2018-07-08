import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { logRender } from '@hitask/utils/debug';
import HierarchyItem from '../../containers/HierarchyItemContainer';

const ItemGroupBody = ({
	id,
	itemsKeys,
	containerId,
	transitionName,
	getLastExpandedItemInfo,
	setLastExpandedItemInfo,
	recurInstanceDate,
}) => {
	logRender(`render ItemGroupBody (${id})`);
	return (
		<ReactCSSTransitionGroup
			transitionName={transitionName}
			transitionEnterTimeout={500}
			transitionLeaveTimeout={500}
		>
			{itemsKeys.map((itemId, index) => (
				<HierarchyItem
					id={itemId}
					itemGroupId={id}
					key={itemId}
					index={index}
					containerId={containerId}
					getLastExpandedItemInfo={getLastExpandedItemInfo}
					setLastExpandedItemInfo={setLastExpandedItemInfo}
					recurInstanceDate={recurInstanceDate}
				/>
			))}
		</ReactCSSTransitionGroup>
	);
};

const { arrayOf, number, string, func } = PropTypes;
ItemGroupBody.propTypes = {
	id: string,
	itemsKeys: arrayOf(number).isRequired,
	containerId: string,
	transitionName: string,
	getLastExpandedItemInfo: func.isRequired,
	setLastExpandedItemInfo: func.isRequired,
	recurInstanceDate: string,
};

ItemGroupBody.defaultProps = {
	id: '',
	containerId: '',
	transitionName: '',
	recurInstanceDate: null,
};

export default ItemGroupBody;
