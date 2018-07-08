import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isEqualWith from 'lodash/isEqualWith';
import { ITEMS_UPDATE_INTERVAL } from '@hitask/constants/item';
import timer from '@hitask/utils/timer';
import { logRender } from '@hitask/utils/debug';
import BigCalendar from '../../containers/BigCalendarContainer';
import NavbarMini from '../../containers/NavbarMiniContainer';
import Spinner from '../Spinner';
import classes from './AuthorizedCalendarExt.scss';

const IGNORE_PROPS_UPDATE = ['lastItemsFetchTime'];

class AuthorizedCalendarExt extends Component {
	componentWillMount() {
		const { userId, userName, userEmail, accountType } = this.props;
		const userData = {
			userId,
			userName,
			userEmail,
			accountType,
		};
		this.props.trackUser(userData);

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
		const { itemsWereLoaded } = this.props;
		logRender('render AuthorizedCalendarExt');
		const showLoader = !itemsWereLoaded;
		return (
			<div
				className={classNames(classes.authorizedCalendar, {
					[classes.hasNavbar]: this.props.hasNavbar,
				})}
				data-test="authorized-container"
			>
				<NavbarMini />
				{showLoader ? <Spinner wrapped /> : <BigCalendar />}
			</div>
		);
	}
}

const { func, bool, number, string } = PropTypes;
AuthorizedCalendarExt.propTypes = {
	trackUser: func.isRequired,
	loadPrefsAndApplyToLocale: func.isRequired,
	hasNavbar: bool,
	fetchItems: func.isRequired,
	forceDataFetch: bool.isRequired,
	lastItemsFetchTime: number,
	itemsWereLoaded: bool.isRequired,
	userId: number.isRequired,
	userName: string,
	userEmail: string,
	accountType: string,
};

AuthorizedCalendarExt.defaultProps = {
	hasNavbar: true,
	lastItemsFetchTime: 0,
	userName: null,
	userEmail: null,
	accountType: null,
};

export default AuthorizedCalendarExt;
