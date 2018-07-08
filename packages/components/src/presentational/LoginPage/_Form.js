import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Translate, I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import classes from './LoginPage.scss';

const Form = ({ handleSubmit }) => (
	<form onSubmit={handleSubmit} className={classes.signinForm} data-test="login-form">
		<div className={classes.formGroup}>
			<div className={classes.formGroup}>
				<Field
					name="login"
					type="text"
					component="input"
					className={classes.formControl}
					placeholder={I18n.t(__T('hi.login.login_name'))}
					required
					minLength={5}
					maxLength={64}
					autoFocus="autoFocus"
				/>
			</div>
			<div className={classes.formGroup}>
				<Field
					name="password"
					type="password"
					component="input"
					className={classes.formControl}
					placeholder={I18n.t(__T('hi.login.password'))}
					required
					minLength={6}
				/>
			</div>
		</div>
		<div className={classes.formFooter}>
			<button
				type="submit"
				className={classNames(
					['btn', 'btn--rounded', 'btn--primary', 'btn--full-width'].map(k => classes[k])
				)}
			>
				<div className="text--center">
					<Translate value={__T('hi.login.signin_button')} />
				</div>
			</button>
		</div>
	</form>
);

Form.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
};

export default Form;
