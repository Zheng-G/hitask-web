import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import FlexDecorator from '../../Catalog/FlexDecorator';
import { formatTagSearchInputField, parseTagSearchInputField } from '../common';
import TagSearchInput from './TagSearchInput';

storiesOf('Item Form/TagSearchInput', module)
	.addDecorator(FlexDecorator)
	.add('default', () => (
		<ReduxFormInput
			defaultValue=""
			parse={parseTagSearchInputField}
			format={formatTagSearchInputField}
		>
			<TagSearchInput
				items={['tag1', 'tag2', 'tag3', 'tag4']}
				inputProps={{
					placeholder: 'Search',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with initial value', () => (
		<ReduxFormInput
			defaultValue="__#tag1 __#tag2 __#tag3 other text..."
			parse={parseTagSearchInputField}
			format={formatTagSearchInputField}
		>
			<TagSearchInput
				items={['tag1', 'tag2', 'tag3', 'tag4']}
				inputProps={{
					placeholder: 'Search',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with initial value (only tags)', () => (
		<ReduxFormInput
			defaultValue="__#tag1 __#tag2 __#tag3"
			parse={parseTagSearchInputField}
			format={formatTagSearchInputField}
		>
			<TagSearchInput
				items={['tag1', 'tag2', 'tag3', 'tag4']}
				inputProps={{
					placeholder: 'Search',
				}}
			/>
		</ReduxFormInput>
	));
