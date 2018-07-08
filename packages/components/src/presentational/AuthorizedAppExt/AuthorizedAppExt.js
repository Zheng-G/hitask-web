import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isEqualWith from 'lodash/isEqualWith';
import { ITEMS_UPDATE_INTERVAL } from '@hitask/constants/item';
import timer from '@hitask/utils/timer';
import { logRender } from '@hitask/utils/debug';
import NavbarMini from '../../containers/NavbarMiniContainer';
import ItemInsertLinkButton from '../../containers/ItemInsertLinkButtonContainer';
import ItemsPanelMini from '../../containers/ItemsPanelMiniContainer';
import classes from './AuthorizedAppExt.scss';

const IGNORE_PROPS_UPDATE = ['lastItemsFetchTime'];

class AuthorizedAppExt extends Component {
	componentWillMount() {
		const { userId, userName, userEmail, accountType } = this.props;
		const userData = {
			userId,
			userName,
			userEmail,
			accountType,
		};
		this.props.trackUser(userData);

		this.props.loadContactsAndBusiness();
		this.props.loadPrefsAndApplyToLocale();
		if (this.props.forceDataFetch) {
			timer.setRecurringTimer('fetchItems', ITEMS_UPDATE_INTERVAL, this.props.fetchItems);
		} else {
			timer.setRecurringTimer(
				'fetchItems',
				ITEMS_UPDATE_INTERVAL,
				this.props.fetchItems,
				this.props.lastItemsFetchTime
			);
		}
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
		timer.removeTimer('fetchItems');
	}

	render() {
		logRender('render AuthorizedAppExt');
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
				<ItemsPanelMini />
			</div>
		);
	}
}

const { func, bool, string, number } = PropTypes;
AuthorizedAppExt.propTypes = {
	trackUser: func.isRequired,
	loadPrefsAndApplyToLocale: func.isRequired,
	loadContactsAndBusiness: func.isRequired,
	fetchItems: func.isRequired,
	forceDataFetch: bool.isRequired,
	lastItemsFetchTime: number,
	hasNavbar: bool,
	userId: number.isRequired,
	userName: string,
	userEmail: string,
	accountType: string,
};

AuthorizedAppExt.defaultProps = {
	hasNavbar: true,
	lastItemsFetchTime: 0,
	userName: null,
	userEmail: null,
	accountType: null,
};

export default AuthorizedAppExt;
