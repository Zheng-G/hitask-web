import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getItemSortedHierarchy, itemsSelector } from '@hitask/modules/items';
import { sortOrderSelector } from '@hitask/modules/tabs';
import HierarchyItem from '../presentational/HierarchyItem';

export const mapActionCreators = {};

const sortedHierarchySelectorFactory = itemId =>
	createSelector([itemsSelector, sortOrderSelector], (itemsHash, sortOrder) =>
		getItemSortedHierarchy(itemsHash, itemId, sortOrder)
	);

const mapStateToProps = (initState, { id }) => {
	const sortedHierarchySelector = sortedHierarchySelectorFactory(id);
	return state => ({
		isTopLevel: true, // Has not parent in the list
		sortedHierarchy: sortedHierarchySelector(state),
	});
};

export default connect(mapStateToProps, mapActionCreators)(HierarchyItem);
