import React from 'react';
import { Translate } from 'react-redux-i18n';
import EmptyStateItem from '@hitask/icons/EmptyStateItem.svg';
import classes from './NoItems.scss';

const NoItems = () => (
	<div className={classes.noItemsContainer}>
		<EmptyStateItem width={100} height={100} className={classes.noItemsIcon} />
		<Translate value={__T('js.center.no_items')} />
	</div>
);

export default NoItems;
