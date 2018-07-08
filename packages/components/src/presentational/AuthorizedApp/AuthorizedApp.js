import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isEqualWith from 'lodash/isEqualWith';
import {
	CONTRACTS_BUSINESS_UPDATE_INTERVAL,
	PREFS_UPDATE_INTERVAL,
	ITEMS_UPDATE_INTERVAL,
} from '@hitask/constants/item';
import timer from '@hitask/utils/timer';
import { logRender } from '@hitask/utils/debug';
import NavbarMini from '../../containers/NavbarMiniContainer';
import ItemInsertLinkButton from '../../containers/ItemInsertLinkButtonContainer';
import ItemsPanel from '../../containers/ItemsPanelContainer';
import ItemsErrorDialog from '../../containers/Dialogs/ItemsErrorDialogContainer';
import UserErrorDialog from '../../containers/Dialogs/UserErrorDialogContainer';
import ConfirmItemCompleteAlert from '../../containers/Alerts/ConfirmItemCompleteAlertContainer';
import InfoMessageAlert from '../../containers/Alerts/InfoMessageAlertContainer';
import classes from './AuthorizedApp.scss';

const IGNORE_PROPS_UPDATE = [];

class AuthorizedApp extends Component {
	componentWillMount() {
		const {
			loadPrefsAndApplyToLocale,
			loadContactsAndBusiness,
			fetchItems,
			sendGATracking,
		} = this.props;

		sendGATracking();

		timer.setRecurringTimer(
			'loadContactsAndBusiness',
			CONTRACTS_BUSINESS_UPDATE_INTERVAL,
			loadContactsAndBusiness
		);
		timer.setRecurringTimer(
			'loadPrefsAndApplyToLocale',
			PREFS_UPDATE_INTERVAL,
			loadPrefsAndApplyToLocale
		);
		timer.setRecurringTimer('fetchItems', ITEMS_UPDATE_INTERVAL, fetchItems);
	}

	shouldComponentUpdate(nextProps) {
		if (
			_isEqualWith(this.props, nextProps, (currProp, nextProp, propKey) => {
				if (IGNORE_PROPS_UPDATE.includes(propKey)) return true;
				return undefined;
			})
		)
			return false;
		return true;
	}

	componentWillUnmount() {
		timer.removeTimer('loadContactsAndBusiness');
		timer.removeTimer('loadPrefsAndApplyToLocale');
		timer.removeTimer('fetchItems');
	}

	render() {
		logRender('render AuthorizedApp');
		return (
			<div
				className={classNames(classes.authorizedApp, {
					[classes.hasNavbar]: this.props.hasNavbar,
				})}
				data-test="authorized-container"
			>
				<NavbarMini>
					<ItemInsertLinkButton />
				</NavbarMini>
				<ItemsPanel />
				<ItemsErrorDialog />
				<UserErrorDialog />
				<ConfirmItemCompleteAlert />
				<InfoMessageAlert />
			</div>
		);
	}
}

const { func, bool } = PropTypes;
AuthorizedApp.propTypes = {
	loadPrefsAndApplyToLocale: func.isRequired,
	loadContactsAndBusiness: func.isRequired,
	fetchItems: func.isRequired,
	sendGATracking: func.isRequired,
	hasNavbar: bool,
};

AuthorizedApp.defaultProps = {
	hasNavbar: true,
};

export default AuthorizedApp;
