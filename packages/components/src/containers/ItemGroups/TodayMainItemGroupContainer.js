import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { ItemGroups } from '@hitask/constants/layout';
import { DateQuery } from '@hitask/constants/item';
import { todayMainQuerySelector, sortItemsHash } from '@hitask/modules/items';
import { sortOrderSelector } from '@hitask/modules/tabs';
import ItemGroup from '../../presentational/ItemGroup';
import { mapActionCreators } from './common';

const itemsKeysSelector = createSelector(
	[todayMainQuerySelector, sortOrderSelector],
	sortItemsHash
);

const mapStateToProps = (state, { containerId }) => ({
	id: ItemGroups.TODAY_MAIN,
	itemsKeys: itemsKeysSelector(state),
	transitionName: 'fadeOutDown',
	recurInstanceDate: DateQuery.TODAY,
	containerId,
});

export default connect(mapStateToProps, mapActionCreators)(ItemGroup);
