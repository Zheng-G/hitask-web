import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { I18n } from 'react-redux-i18n';
import { ItemGroups } from '@hitask/constants/layout';
import { allCompletedQuerySelector, sortItemsHash } from '@hitask/modules/items';
import { sortOrderSelector, isItemGroupOpenedSelector } from '@hitask/modules/tabs';
import ItemGroup from '../../presentational/ItemGroup';
import { mapActionCreators } from './common';

const itemsKeysSelector = createSelector(
	[allCompletedQuerySelector, sortOrderSelector],
	sortItemsHash
);

const mapStateToProps = (state, { containerId }) => ({
	id: ItemGroups.ALL_COMPLETED,
	itemsKeys: itemsKeysSelector(state),
	transitionName: 'fadeOutUp',
	containerId,
	isOpen: isItemGroupOpenedSelector(state, ItemGroups.ALL_COMPLETED),
	groupTitle: I18n.t(__T('js.completed.title')),
});

export default connect(mapStateToProps, mapActionCreators)(ItemGroup);
