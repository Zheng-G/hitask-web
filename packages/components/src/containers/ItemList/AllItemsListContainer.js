import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Tabs } from '@hitask/constants/tabs';
import { queryItemsSelectorFactory } from '@hitask/modules/items';
import { expandedItemSelector } from '@hitask/modules/tabs';
import { centralHeaderVisibleSelector } from '@hitask/modules/layout';
import ItemListAll from '../../presentational/ItemList/ItemListAll';
import { mapActionCreators } from './common';

const itemsAmountSelector = createSelector(
	[queryItemsSelectorFactory()],
	itemsHash => Object.keys(itemsHash).length
);

const mapStateToProps = state => ({
	id: Tabs.ALL_ITEMS,
	containerId: 'tab-panel_item-tabs-all',
	noItems: !itemsAmountSelector(state),
	someItemIsExpanded: !!expandedItemSelector(state),
	centralHeaderVisible: centralHeaderVisibleSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemListAll);
