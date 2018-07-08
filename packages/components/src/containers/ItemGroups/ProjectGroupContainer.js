import { connect } from 'react-redux';
import { itemSelector, sortItemsHash, projectChildrenSelector } from '@hitask/modules/items';
import { sortOrderSelector } from '@hitask/modules/tabs';
import {
	toggleProjectHierarchy,
	toggleProjectGroups,
	isProjectHierarchyOpenedSelector,
} from '@hitask/modules/layout';
import ItemGroup from '../../presentational/ItemGroup';

const mapActionCreators = (dispatch, { id }) => ({
	toggleCollapse(event) {
		if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
			dispatch(toggleProjectGroups({ itemId: id }));
		} else {
			dispatch(toggleProjectHierarchy({ itemId: id }));
		}
	},
});

const mapStateToProps = (state, { id }) => {
	const project = itemSelector(state, id);
	if (!project) {
		return {
			isOpen: false,
			itemsKeys: [],
		};
	}

	const sortOrder = sortOrderSelector(state);
	const itemsHash = projectChildrenSelector(state, id);
	return {
		id: `PROJECT_${id}`,
		itemsKeys: sortItemsHash(itemsHash, sortOrder),
		transitionName: 'fadeOutDown',
		groupTitle: project.title,
		isOpen: isProjectHierarchyOpenedSelector(state, id),
	};
};

export default connect(mapStateToProps, mapActionCreators)(ItemGroup);
