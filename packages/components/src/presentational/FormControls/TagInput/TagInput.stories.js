import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import { parseTagInputField, formatTagInputField } from '../common';
import TagInput from './TagInput';

storiesOf('Item Form/TagInput', module).add('default', () => (
	<ReduxFormInput
		defaultValue="tag1,tag2"
		parse={parseTagInputField}
		format={formatTagInputField}
	>
		<TagInput
			inputProps={{
				placeholder: 'Type tags here',
			}}
		/>
	</ReduxFormInput>
));
