import { connect } from 'react-redux';
import { parsedEntitiesSelector } from '@hitask/modules/import';
import ImportPage from '../presentational/ImportPage';

const mapActionCreators = {};

const mapStateToProps = state => ({
	isConfirming: !!parsedEntitiesSelector(state, 'items'),
});

export default connect(mapStateToProps, mapActionCreators)(ImportPage);
