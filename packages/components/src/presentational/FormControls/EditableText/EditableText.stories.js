import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import EditableText from './EditableText';

storiesOf('Simple/EditableText', module)
	.add('default', () => (
		<ReduxFormInput defaultValue="">
			<EditableText onConfirm={action('confirmed')} placeholder="Type here" />
		</ReduxFormInput>
	))
	.add('textareaStyle', () => (
		<ReduxFormInput defaultValue="">
			<EditableText onConfirm={action('confirmed')} placeholder="Type here" textareaStyle />
		</ReduxFormInput>
	))
	.add('confirmOnEnterKey', () => (
		<ReduxFormInput defaultValue="">
			<EditableText
				onConfirm={action('confirmed')}
				placeholder="Type here"
				textareaStyle
				confirmOnEnterKey
			/>
		</ReduxFormInput>
	))
	.add('with minLines', () => (
		<ReduxFormInput defaultValue="">
			<EditableText
				onConfirm={action('confirmed')}
				placeholder="Type here"
				minLines={4}
				maxLines={4}
				maxLength={5000}
				textareaStyle
			/>
		</ReduxFormInput>
	));
