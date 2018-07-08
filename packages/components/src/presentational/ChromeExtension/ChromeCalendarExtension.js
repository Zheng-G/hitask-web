import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FocusStyleManager } from '@hitask/blueprint-core';
import { DefaultPrefs } from '@hitask/constants/preferences';
import { logRender } from '@hitask/utils/debug';
import LoginPage from '../../containers/LoginPageContainer';
import ItemViewDialog from '../../containers/Dialogs/ItemViewDialogContainer';
import AuthorizedCalendarExt from '../../containers/AuthorizedCalendarExtContainer';
import LoadingThrobber from '../LoadingThrobber';
import './ChromeExtension.scss';

FocusStyleManager.onlyShowFocusOnTabs();

class ChromeCalendarExtension extends Component {
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
		logRender('render ChromeCalendarExtension');
		return noLocales ? (
			<LoadingThrobber />
		) : (
			<div className={`full-height color-theme-${themeId}`}>
				{hasSession ? (
					<AuthorizedCalendarExt forceDataFetch={firstAuthorizedRender} />
				) : (
					<LoginPage />
				)}
				<ItemViewDialog />
			</div>
		);
	}
}

const { func, number, bool } = PropTypes;

ChromeCalendarExtension.propTypes = {
	hasSession: bool.isRequired,
	getLocalWebappSession: func.isRequired,
	updateLocale: func.isRequired,
	noLocales: bool.isRequired,
	themeId: number,
};

ChromeCalendarExtension.defaultProps = {
	themeId: DefaultPrefs.themeDesktop,
};

export default ChromeCalendarExtension;
