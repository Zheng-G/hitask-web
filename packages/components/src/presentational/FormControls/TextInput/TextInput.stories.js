import React from 'react';
import { storiesOf } from '@storybook/react';
import { Intent } from '@hitask/blueprint-core';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import TextInput from './TextInput';

storiesOf('Simple/TextInput', module)
	.add('default', () => (
		<ReduxFormInput defaultValue="">
			<TextInput placeholder="Type here" />
		</ReduxFormInput>
	))
	.add('with initial value', () => (
		<ReduxFormInput defaultValue="pass">
			<TextInput placeholder="Enter password" />
		</ReduxFormInput>
	))
	.add('readonly', () => (
		<ReduxFormInput defaultValue="">
			<TextInput placeholder="Readonly field" readOnly leftIconName="add" />
		</ReduxFormInput>
	))
	.add('disabled', () => (
		<ReduxFormInput defaultValue="">
			<TextInput placeholder="Disabled field" disabled fill />
		</ReduxFormInput>
	))
	.add('with intent', () => (
		<ReduxFormInput defaultValue="">
			<TextInput
				placeholder="Type request here"
				intent={Intent.DANGER}
				rightIconName="filter"
				size="large"
			/>
		</ReduxFormInput>
	));
