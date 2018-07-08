import { connect } from 'react-redux';
import { projectsArraySelector } from '@hitask/modules/items';
import { centralHeaderVisibleSelector, syncProjectGroups } from '@hitask/modules/layout';
import { expandedItemSelector } from '@hitask/modules/tabs';
import ItemListProjects from '../../presentational/ItemList/ItemListProjects';
import { mapActionCreators as sharedActionCreators } from './common';

const mapActionCreators = {
	...sharedActionCreators,
	syncProjectGroups,
};

const mapStateToProps = state => ({
	containerId: 'tab-panel_item-tabs-projects',
	projects: projectsArraySelector(state),
	someItemIsExpanded: !!expandedItemSelector(state),
	centralHeaderVisible: centralHeaderVisibleSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemListProjects);
