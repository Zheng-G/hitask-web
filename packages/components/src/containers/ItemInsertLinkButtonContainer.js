import { connect } from 'react-redux';
import { insertLink } from '@hitask/modules/items';
import { toggleCreateForm } from '@hitask/modules/layout';
import { collapseAllItems } from '@hitask/modules/tabs';
import ItemInsertLinkButton from '../presentational/ItemInsertLinkButton';

const mapActionCreators = dispatch => ({
	insertLink: (pageTitle, pageURL) => {
		dispatch(collapseAllItems({}));
		dispatch(toggleCreateForm({ isOpen: true }));
		dispatch(insertLink({ pageTitle, pageURL }));
	},
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapActionCreators)(ItemInsertLinkButton);
