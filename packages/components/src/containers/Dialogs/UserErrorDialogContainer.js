import { connect } from 'react-redux';
import { errorSelector, clearError } from '@hitask/modules/user';
import ErrorDialog from '../../presentational/Dialogs/ErrorDialog';

const mapActionCreators = dispatch => ({
	closeDialog: () => dispatch(clearError()),
});

const mapStateToProps = state => {
	const error = errorSelector(state);
	return {
		isOpen: !!error,
		error,
	};
};

export default connect(mapStateToProps, mapActionCreators)(ErrorDialog);
