/* eslint react/prop-types:0 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import FlexDecorator from '../../Catalog/FlexDecorator';
import MultiSelect from './MultiSelect';
import { parseMultiSelectField, formatMultiSelectField } from '../common';

const customItemRenderer = ({ handleClick, isActive, isSelected, item }) => (
	<div key={item.id}>
		<button onClick={handleClick} key={item.id}>
			{`${isSelected ? 'Selected ' : ''}${isActive ? 'active ' : ''}${item.label}`}
		</button>
	</div>
);

storiesOf('Simple/MultiSelect', module)
	.addDecorator(FlexDecorator)
	.add('default', () => (
		<ReduxFormInput
			defaultValue=""
			parse={parseMultiSelectField}
			format={formatMultiSelectField}
		>
			<MultiSelect
				items={[
					{
						id: 1,
						label: 'Item 1',
					},
					{
						id: 2,
						label: 'Item 2',
					},
					{
						id: 3,
						label: 'Item 3',
					},
					{
						id: 4,
						label: 'Item 4',
					},
				]}
				tagInputProps={{
					placeholder: 'Type here',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with initial value', () => (
		<ReduxFormInput
			defaultValue="1"
			parse={parseMultiSelectField}
			format={formatMultiSelectField}
		>
			<MultiSelect
				items={[
					{
						id: 1,
						label: 'Item 1',
					},
					{
						id: 2,
						label: 'Item 2',
					},
					{
						id: 3,
						label: 'Item 3',
					},
					{
						id: 4,
						label: 'Item 4',
					},
				]}
				tagInputProps={{
					placeholder: 'Type here',
				}}
				closeOnSelect
			/>
		</ReduxFormInput>
	))
	.add('with custom renderer', () => (
		<ReduxFormInput
			defaultValue="1,3"
			parse={parseMultiSelectField}
			format={formatMultiSelectField}
		>
			<MultiSelect
				items={[
					{
						id: 1,
						label: 'Item 1',
					},
					{
						id: 2,
						label: 'Item 2',
					},
					{
						id: 3,
						label: 'Item 3',
					},
					{
						id: 4,
						label: 'Item 4',
					},
				]}
				itemRenderer={customItemRenderer}
				tagInputProps={{
					placeholder: 'Type here',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with wrong value', () => (
		<ReduxFormInput
			defaultValue="1,5"
			parse={parseMultiSelectField}
			format={formatMultiSelectField}
		>
			<MultiSelect
				items={[
					{
						id: 1,
						label: 'Item 1',
					},
					{
						id: 2,
						label: 'Item 2',
					},
					{
						id: 3,
						label: 'Item 3',
					},
					{
						id: 4,
						label: 'Item 4',
					},
				]}
			/>
		</ReduxFormInput>
	));
