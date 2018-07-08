import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FocusStyleManager } from '@hitask/blueprint-core';
import { DefaultPrefs } from '@hitask/constants/preferences';
import { logRender } from '@hitask/utils/debug';
import LoginPage from '../../containers/LoginPageContainer';
import ItemsErrorDialog from '../../containers/Dialogs/ItemsErrorDialogContainer';
import UserErrorDialog from '../../containers/Dialogs/UserErrorDialogContainer';
import ConfirmItemCompleteAlert from '../../containers/Alerts/ConfirmItemCompleteAlertContainer';
import InfoMessageAlert from '../../containers/Alerts/InfoMessageAlertContainer';
import AuthorizedAppExt from '../../containers/AuthorizedAppExtContainer';
import LoadingThrobber from '../LoadingThrobber';
import './ChromeExtension.scss';

FocusStyleManager.onlyShowFocusOnTabs();

class ChromeAppExtension extends Component {
	componentWillMount() {
		const { getLocalWebappSession, noLocales, updateLocale } = this.props;
		getLocalWebappSession();
		if (noLocales) {
			updateLocale();
		}
	}
	render() {
		const { hasSession, noLocales, themeId } = this.props;
		const firstAuthorizedRender = !this.hadSession && hasSession;
		this.hadSession = hasSession;
		logRender('render ChromeAppExtension');
		return noLocales ? (
			<LoadingThrobber />
		) : (
			<div className={`full-height color-theme-${themeId}`}>
				{hasSession ? (
					<AuthorizedAppExt forceDataFetch={firstAuthorizedRender} />
				) : (
					<LoginPage />
				)}
				<ItemsErrorDialog />
				<UserErrorDialog />
				<ConfirmItemCompleteAlert />
				<InfoMessageAlert />
			</div>
		);
	}
}

const { bool, func, number } = PropTypes;

ChromeAppExtension.propTypes = {
	hasSession: bool.isRequired,
	getLocalWebappSession: func.isRequired,
	updateLocale: func.isRequired,
	noLocales: bool.isRequired,
	themeId: number,
};

ChromeAppExtension.defaultProps = {
	themeId: DefaultPrefs.themeDesktop,
};

export default ChromeAppExtension;
