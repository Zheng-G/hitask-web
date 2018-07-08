import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Tabs } from '@hitask/constants/tabs';
import { DateQuery } from '@hitask/constants/item';
import { queryItemsSelectorFactory } from '@hitask/modules/items';
import { expandedItemSelector } from '@hitask/modules/tabs';
import { centralHeaderVisibleSelector } from '@hitask/modules/layout';
import ItemListToday from '../../presentational/ItemList/ItemListToday';
import { mapActionCreators } from './common';

const itemsAmountSelector = createSelector(
	[
		queryItemsSelectorFactory({
			date: [DateQuery.TODAY, DateQuery.OVERDUE],
		}),
	],
	itemsHash => Object.keys(itemsHash).length
);

const mapStateToProps = state => ({
	id: Tabs.TODAY,
	containerId: 'tab-panel_item-tabs-today',
	noItems: !itemsAmountSelector(state),
	someItemIsExpanded: !!expandedItemSelector(state),
	centralHeaderVisible: centralHeaderVisibleSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemListToday);
