import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { login, loadingSelector, errorSelector } from '@hitask/modules/auth';
import validate from '@hitask/utils/formValidation';
import { ResponseStatus } from '@hitask/constants/server';
import { Routes } from '@hitask/constants/layout';
import LoginPage from '../presentational/LoginPage';

const mapActionCreators = {};

const mapStateToProps = state => {
	const error = errorSelector(state);
	let errorMessage = null;
	let showHelpMsg = false;
	if (error) {
		errorMessage = error.message;
		if (error.response) {
			errorMessage = error.response.errorMessage;
			showHelpMsg = error.response.status === ResponseStatus.FORBID;
		}
	}
	return {
		// Component props:
		loading: loadingSelector(state),
		errorMessage,
		showHelpMsg,
		sendGATracking() {
			if (window.manualGAnalytics) {
				window.manualGAnalytics.pageview(Routes.LOGIN, 'Login page');
			}
		},
	};
};

const LoginFormWrapped = reduxForm({
	form: 'LoginForm',
	validate: values => ({
		...validate({
			values,
			requiredFields: ['login', 'password'],
		}),
	}),
	onSubmit: (values, dispatch) => dispatch(login(values)),
})(LoginPage);

export default connect(mapStateToProps, mapActionCreators)(LoginFormWrapped);
