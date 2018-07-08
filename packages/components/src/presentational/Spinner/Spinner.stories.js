import React from 'react';
import { storiesOf } from '@storybook/react';
import Spinner from './Spinner';

storiesOf('Simple/Spinner', module)
	.add('default', () => <Spinner />)
	.add('wrapped', () => <Spinner wrapped />);
