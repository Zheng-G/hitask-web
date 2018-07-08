import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import classNames from 'classnames';
import Link from '../LinkAdaptive';
import classes from './LoginPage.scss';

const ErrorMessage = ({ errorMessage, showHelpMsg }) =>
	errorMessage && (
		<div className={classNames(classes.formError, classes.formError)} data-test="login-error">
			<div>{errorMessage}</div>
			{showHelpMsg && (
				<div>
					<Link href={`${__PLAY_APP_BASE_URL__}/recover`}>
						<Translate value={__T('hi.login.error_help_login')} />
					</Link>
				</div>
			)}
		</div>
	);

const { string, bool } = PropTypes;
ErrorMessage.propTypes = {
	errorMessage: string,
	showHelpMsg: bool,
};

ErrorMessage.defaultProps = {
	errorMessage: null,
	showHelpMsg: false,
};

export default ErrorMessage;
