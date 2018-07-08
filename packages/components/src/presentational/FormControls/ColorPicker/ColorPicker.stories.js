import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import ColorPicker from './ColorPicker';

storiesOf('Item Form/ColorPicker', module).add('default', () => (
	<div style={{ textAlign: 'center' }}>
		<ReduxFormInput defaultValue={1}>
			<ColorPicker />
		</ReduxFormInput>
	</div>
));
