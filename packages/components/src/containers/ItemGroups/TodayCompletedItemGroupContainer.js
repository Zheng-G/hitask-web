import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { I18n } from 'react-redux-i18n';
import { ItemGroups } from '@hitask/constants/layout';
import { DateQuery } from '@hitask/constants/item';
import { todayCompletedQuerySelector, sortItemsHash } from '@hitask/modules/items';
import { sortOrderSelector, isItemGroupOpenedSelector } from '@hitask/modules/tabs';
import ItemGroup from '../../presentational/ItemGroup';
import { mapActionCreators } from './common';

const itemsKeysSelector = createSelector(
	[todayCompletedQuerySelector, sortOrderSelector],
	sortItemsHash
);

const mapStateToProps = (state, { containerId }) => ({
	id: ItemGroups.TODAY_COMPLETED,
	itemsKeys: itemsKeysSelector(state),
	transitionName: 'fadeOutUp',
	containerId,
	groupTitle: I18n.t(__T('js.completed.title')),
	isOpen: isItemGroupOpenedSelector(state, ItemGroups.TODAY_COMPLETED),
	recurInstanceDate: DateQuery.TODAY,
});

export default connect(mapStateToProps, mapActionCreators)(ItemGroup);
