import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Translate, I18n } from 'react-redux-i18n';
import { Helmet } from 'react-helmet';
import { isExtension, isElectron } from '@hitask/utils/helpers';
import { logRender } from '@hitask/utils/debug';
import Header from '../HeaderSimplified';
import Link from '../LinkAdaptive';
import LoadingThrobber from '../LoadingThrobber';
import GoogleLink from '../GoogleLink';
import ErrorMessage from './_ErrorMessage';
import Form from './_Form';
import classes from './LoginPage.scss';

const PageHead = () => (
	<Helmet>
		<title>{I18n.t(__T('hi.login.page_title.hitask'))}</title>
	</Helmet>
);

class LoginPage extends Component {
	componentWillMount() {
		this.props.sendGATracking();
		this.props.onLoginReady();
	}

	render() {
		const { loading, errorMessage, handleSubmit, showHelpMsg, requestGOAuthToken } = this.props;
		logRender('render LoginPage');
		return (
			<div className="full-height ui-light-background">
				<PageHead />
				<Header />
				<main className="full-height">
					<section className={classNames(classes.container, classes.centeredContainer)}>
						<div
							className={classNames(
								classes.login,
								classes.centeredContent,
								'ui-white-background',
								{
									[classes.loadingState]: loading,
									[classes.noShadow]: isExtension || isElectron,
								}
							)}
						>
							<header>
								<nav className={classes.centeredContentTabs}>
									<span className={classes.centeredContentTabsTitle}>
										<Translate value={__T('hi.login.signin.title')} />
									</span>
									<Link
										href={`${__PLAY_APP_BASE_URL__}/signup`}
										className={classNames(
											['btn', 'btn--sm', 'btn--rounded', 'btn--tertiary'].map(
												k => classes[k]
											)
										)}
									>
										<Translate value={__T('hi.login.signup_message')} />
									</Link>
								</nav>
							</header>
							{errorMessage && (
								<ErrorMessage
									errorMessage={errorMessage}
									showHelpMsg={showHelpMsg}
								/>
							)}
							<Form handleSubmit={handleSubmit} />
							<div className={classNames(classes.socialSignin)}>
								<p className="text--color-complementary text--center text--small">
									<Translate value={__T('hi.login.with_title')} />
								</p>
								{isElectron ? (
									<GoogleLink
										text="Google"
										href={null}
										onClick={requestGOAuthToken}
									/>
								) : (
									<GoogleLink
										text="Google"
										href={`${__PLAY_APP_BASE_URL__}/login/socialauth?state=google`}
									/>
								)}
							</div>
							<footer
								className={classNames(
									classes.centeredContentFooter,
									'text--center'
								)}
							>
								<Link href={`${__PLAY_APP_BASE_URL__}/recover`}>
									<Translate value={__T('hi.login.error_help_login')} />
								</Link>
							</footer>
							{loading && <LoadingThrobber className={classes.loadingThrobber} />}
						</div>
					</section>
				</main>
			</div>
		);
	}
}

const { func, bool, string } = PropTypes;
LoginPage.propTypes = {
	handleSubmit: func.isRequired,
	sendGATracking: func.isRequired,
	onLoginReady: func,
	requestGOAuthToken: func,
	loading: bool,
	errorMessage: string,
	showHelpMsg: bool,
};

const emptyFunc = () => {};
LoginPage.defaultProps = {
	onLoginReady: emptyFunc,
	requestGOAuthToken: emptyFunc,
	loading: false,
	errorMessage: null,
	showHelpMsg: false,
};

export default LoginPage;
