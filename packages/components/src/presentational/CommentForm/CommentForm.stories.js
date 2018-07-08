import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CommentForm from './CommentForm';

storiesOf('Item View/CommentForm', module)
	.add('default', () => <CommentForm handleSubmit={action('submitted')} initialValue="" />)
	.add('with initial value', () => (
		<CommentForm handleSubmit={action('submitted')} initialValue="First comment" />
	));
