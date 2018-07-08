import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { ItemGroups } from '@hitask/constants/layout';
import { allMainQuerySelector, sortItemsHash } from '@hitask/modules/items';
import { sortOrderSelector } from '@hitask/modules/tabs';
import ItemGroup from '../../presentational/ItemGroup';
import { mapActionCreators } from './common';

const itemsKeysSelector = createSelector([allMainQuerySelector, sortOrderSelector], sortItemsHash);

const mapStateToProps = (state, { containerId }) => ({
	id: ItemGroups.ALL_MAIN,
	itemsKeys: itemsKeysSelector(state),
	transitionName: 'fadeOutDown',
	containerId,
});

export default connect(mapStateToProps, mapActionCreators)(ItemGroup);
