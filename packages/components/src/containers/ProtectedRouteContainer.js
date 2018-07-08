import { connect } from 'react-redux';
import { hasSessionSelector } from '@hitask/modules/auth';
import ProtectedRoute from '../presentational/ProtectedRoute';

const mapActionCreators = {};

const mapStateToProps = state => ({
	hasSession: hasSessionSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ProtectedRoute);
