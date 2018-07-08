import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { I18n } from 'react-redux-i18n';
import { ItemGroups } from '@hitask/constants/layout';
import { overdueQuerySelector, sortItemsHash } from '@hitask/modules/items';
import { sortOrderSelector, isItemGroupOpenedSelector } from '@hitask/modules/tabs';
import ItemGroup from '../../presentational/ItemGroup';
import { mapActionCreators } from './common';

const itemsKeysSelector = createSelector([overdueQuerySelector, sortOrderSelector], sortItemsHash);

const mapStateToProps = (state, { containerId }) => ({
	id: ItemGroups.TODAY_OVERDUE,
	itemsKeys: itemsKeysSelector(state),
	transitionName: 'fadeOutDown',
	containerId,
	groupTitle: I18n.t(__T('js.center.overdue')),
	isOpen: isItemGroupOpenedSelector(state, ItemGroups.TODAY_OVERDUE),
});

export default connect(mapStateToProps, mapActionCreators)(ItemGroup);
