import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import SelectNative from './SelectNative';

storiesOf('Simple/SelectNative', module).add('default', () => (
	<ReduxFormInput defaultValue={101}>
		<SelectNative
			items={[
				{
					id: 101,
					label: 'Simple item',
				},
				{
					id: 202,
					label: 'Clickable item',
				},
			]}
		/>
	</ReduxFormInput>
));
