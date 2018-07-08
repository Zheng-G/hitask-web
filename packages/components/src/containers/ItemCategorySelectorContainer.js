import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import ItemCategorySelector from '../presentational/ItemCategorySelector';

const mapActionCreators = {};

const mapStateToProps = (state, { form }) => ({
	category: formValueSelector(form)(state, 'category'),
});

export default connect(mapStateToProps, mapActionCreators)(ItemCategorySelector);
