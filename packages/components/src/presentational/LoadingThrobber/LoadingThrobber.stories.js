import React from 'react';
import { storiesOf } from '@storybook/react';
import LoadingThrobber from './LoadingThrobber';

storiesOf('Simple/LoadingThrobber', module).add('default', () => (
	<div
		style={{
			height: '10rem',
		}}
	>
		<LoadingThrobber />
	</div>
));
