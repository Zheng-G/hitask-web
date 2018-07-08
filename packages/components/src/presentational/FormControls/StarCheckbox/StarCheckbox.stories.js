import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import StarCheckbox from './StarCheckbox';

storiesOf('Item Form/StarCheckbox', module).add('default', () => (
	<ReduxFormInput defaultValue={false}>
		<StarCheckbox />
	</ReduxFormInput>
));
