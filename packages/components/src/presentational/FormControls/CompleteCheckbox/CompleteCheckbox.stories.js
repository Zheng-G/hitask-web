import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import FlexDecorator from '../../Catalog/FlexDecorator';
import CompleteCheckbox from './CompleteCheckbox';

storiesOf('Item List/CompleteCheckbox', module)
	.addDecorator(FlexDecorator)
	.add('default', () => (
		<ReduxFormInput defaultValue={false}>
			<CompleteCheckbox className="custom-classname" id="CompleteCheckbox1" />
		</ReduxFormInput>
	))
	.add('checked', () => (
		<ReduxFormInput defaultValue>
			<CompleteCheckbox className="custom-classname" id="CompleteCheckbox2" />
		</ReduxFormInput>
	))
	.add('disabled', () => (
		<ReduxFormInput defaultValue={false}>
			<CompleteCheckbox disabled className="custom-classname" id="CompleteCheckbox3" />
		</ReduxFormInput>
	));
