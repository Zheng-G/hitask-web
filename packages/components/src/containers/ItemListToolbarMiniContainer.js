import { connect } from 'react-redux';
import { sortOrderSelector, changeSortOrder } from '@hitask/modules/tabs';
import { centralHeaderVisibleSelector } from '@hitask/modules/layout';
import ItemListToolbarMini from '../presentational/ItemListToolbarMini';

const mapActionCreators = dispatch => ({
	changeSortOrder: orderId => dispatch(changeSortOrder({ orderId })),
});

const mapStateToProps = state => ({
	currentSortOrder: sortOrderSelector(state),
	centralHeaderVisible: centralHeaderVisibleSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemListToolbarMini);
