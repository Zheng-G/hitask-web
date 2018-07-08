import { connect } from 'react-redux';
import { projectsSelector } from '@hitask/modules/items';
import ItemProjectSelector from '../presentational/ItemProjectSelector';

const mapActionCreators = {};

const mapStateToProps = state => ({
	projectsHash: projectsSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemProjectSelector);
