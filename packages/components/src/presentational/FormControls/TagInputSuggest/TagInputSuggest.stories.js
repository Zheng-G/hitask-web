import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import FlexDecorator from '../../Catalog/FlexDecorator';
import { parseTagInputField, formatTagInputField } from '../common';
import TagInputSuggest from './TagInputSuggest';

storiesOf('Item Form/TagInputSuggest', module)
	.addDecorator(FlexDecorator)
	.add('default', () => (
		<ReduxFormInput defaultValue="" parse={parseTagInputField} format={formatTagInputField}>
			<TagInputSuggest
				items={['tag3', 'tag4', 'tag-loooooooooong']}
				inputProps={{
					placeholder: 'Add tags',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with initial value', () => (
		<ReduxFormInput
			defaultValue="tag3,tag4"
			parse={parseTagInputField}
			format={formatTagInputField}
		>
			<TagInputSuggest
				items={['tag3', 'tag4', 'tag-loooooooooong']}
				inputProps={{
					placeholder: 'Add tags',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with wrong value', () => (
		<ReduxFormInput
			defaultValue="tag3,tag9"
			parse={parseTagInputField}
			format={formatTagInputField}
		>
			<TagInputSuggest
				items={['tag3', 'tag4', 'tag-loooooooooong']}
				inputProps={{
					placeholder: 'Add tags',
				}}
			/>
		</ReduxFormInput>
	));
