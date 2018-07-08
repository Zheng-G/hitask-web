import React from 'react';
import { storiesOf } from '@storybook/react';
import IconsTable from './IconsTable';

storiesOf('Icons', module)
	.add('Main', () => <IconsTable group="all" title="Main" />)
	.add('Item List', () => <IconsTable group="itemList" title="Item List" />)
	.add('Item Form', () => <IconsTable group="itemForm" title="Item Form" />)
	.add('Item Action', () => <IconsTable group="itemAction" title="Item Actions" />);
