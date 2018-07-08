import React from 'react';
import Header from '../HeaderSimplified';
import classes from './ArchivePage.scss';

const ArchivePage = () => (
	<div>
		<Header />
		<div className={classes.contentWrapper}>
			<div className={classes.content}>
				<h1>Archive</h1>
			</div>
		</div>
	</div>
);

export default ArchivePage;
