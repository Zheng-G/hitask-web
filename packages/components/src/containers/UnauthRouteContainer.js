import { connect } from 'react-redux';
import { hasSessionSelector } from '@hitask/modules/auth';
import UnauthRoute from '../presentational/UnauthRoute';

const mapActionCreators = {};

const mapStateToProps = state => ({
	hasSession: hasSessionSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(UnauthRoute);
