import { connect } from 'react-redux';
import { activeTabSelector, selectTab, collapseAllItems } from '@hitask/modules/tabs';
import {
	centralHeaderVisibleSelector,
	toggleCentralHeader,
	createFormOpenedSelector,
} from '@hitask/modules/layout';
import ItemListTabsMini from '../presentational/ItemListTabsMini';

const mapActionCreators = dispatch => ({
	changeActiveTab(tabId) {
		dispatch(selectTab({ tabId }));
		dispatch(collapseAllItems({}));
		dispatch(toggleCentralHeader({ isOpen: true }));
	},
});

const mapStateToProps = state => ({
	selectedTabId: activeTabSelector(state),
	centralHeaderVisible: centralHeaderVisibleSelector(state),
	createFormOpened: createFormOpenedSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemListTabsMini);
