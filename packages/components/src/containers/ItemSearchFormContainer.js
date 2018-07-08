import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { SEARCH_ITEM_FORM, itemTagsSelector } from '@hitask/modules/items';
// import { formatTagSearchInputField } from '../presentational/FormControls/common';
import ItemSearchForm from '../presentational/ItemSearchForm';

const mapActionCreators = {};

const mapStateToProps = state => ({
	tags: itemTagsSelector(state),
});

const ItemSearchWrapped = reduxForm({
	form: SEARCH_ITEM_FORM,
	initialValues: {
		query: '',
	},
	// onChange(values) {
	// 	const { tags: queryTags, text: queryText } = formatTagSearchInputField(values.query);
	// 	console.log(queryText);
	// 	console.dir(queryTags);
	// },
})(ItemSearchForm);

export default connect(mapStateToProps, mapActionCreators)(ItemSearchWrapped);
