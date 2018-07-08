import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import ColorSelect from './ColorSelect';

storiesOf('Item Form/ColorSelect', module).add('default', () => (
	<ReduxFormInput defaultValue={1}>
		<ColorSelect />
	</ReduxFormInput>
));
