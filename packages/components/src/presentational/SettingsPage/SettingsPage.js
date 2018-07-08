import React from 'react';
import Header from '../HeaderSimplified';
import classes from './SettingsPage.scss';

const SettingsPage = () => (
	<div>
		<Header />
		<div className={classes.contentWrapper}>
			<div className={classes.content}>
				<h1>Settings</h1>
			</div>
		</div>
	</div>
);

export default SettingsPage;
