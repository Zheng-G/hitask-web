import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import _isEqual from 'lodash/isEqual';
import { FocusStyleManager } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import { DefaultPrefs } from '@hitask/constants/preferences';
import LoadingThrobber from '../LoadingThrobber';

FocusStyleManager.onlyShowFocusOnTabs();

const AppHead = () => (
	<Helmet>
		<title>Hitask</title>
	</Helmet>
);

class CoreLayout extends Component {
	componentWillMount() {
		const { noLocales, updateLocale } = this.props;

		if (noLocales) {
			updateLocale();
		}
	}

	componentWillReceiveProps({ userId, userName, userEmail, trackUser, accountType }) {
		const userData = {
			userId,
			userName,
			userEmail,
			accountType,
		};
		if (!_isEqual(this.userData, userData)) {
			// Track changed user data
			trackUser(userData);
			this.userData = userData;
		}
	}

	render() {
		const { children, noLocales, themeId } = this.props;
		logRender('render CoreLayout');
		return (
			<div className={`full-height color-theme-${themeId}`}>
				<AppHead />
				{noLocales ? <LoadingThrobber /> : children}
			</div>
		);
	}
}

const { any, number, func, bool, string } = PropTypes;
CoreLayout.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	updateLocale: func.isRequired,
	noLocales: bool.isRequired,
	trackUser: func.isRequired,
	themeId: number,
	userId: number,
	userName: string,
	userEmail: string,
	accountType: string,
};

CoreLayout.defaultProps = {
	themeId: DefaultPrefs.themeDesktop,
	userId: null,
	userName: null,
	userEmail: null,
	accountType: null,
};

export default CoreLayout;
