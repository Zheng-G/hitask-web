import { connect } from 'react-redux';
import { itemTagsSelector } from '@hitask/modules/items';
import ItemTagsSelector from '../presentational/ItemTagsSelector';

const mapActionCreators = {};

const mapStateToProps = state => ({
	tags: itemTagsSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemTagsSelector);
