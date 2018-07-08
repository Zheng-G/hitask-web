import { connect } from 'react-redux';
import { wereLoadedSelector } from '@hitask/modules/items';
import { collapseAllItems } from '@hitask/modules/tabs';
import {
	centralHeaderVisibleSelector,
	createFormOpenedSelector,
	toggleCreateForm,
} from '@hitask/modules/layout';
import ItemsPanel from '../presentational/ItemsPanel';

const mapActionCreators = {
	toggleCreateForm,
	collapseAllItems,
};

const mapStateToProps = state => ({
	itemsWereLoaded: wereLoadedSelector(state),
	createFormOpened: createFormOpenedSelector(state),
	centralHeaderVisible: centralHeaderVisibleSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemsPanel);
