/* eslint react/prop-types:0 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import Select from './Select';

const customItemRenderer = ({ handleClick, isActive, isSelected, item }) => (
	<div key={item.id}>
		<button onClick={handleClick} key={item.id}>
			{`${isSelected ? 'Selected ' : ''}${isActive ? 'active ' : ''}${item.label}`}
		</button>
	</div>
);

storiesOf('Simple/Select', module)
	.add('default', () => (
		<ReduxFormInput defaultValue={101}>
			<Select
				items={[
					{
						id: 101,
						label: 'Simple item',
					},
					{
						id: 202,
						label: 'Clickable item',
					},
				]}
			/>
		</ReduxFormInput>
	))
	.add('with custom handler', () => (
		<ReduxFormInput defaultValue={1}>
			<Select
				items={[
					{
						id: 1,
						label: 'None',
					},
					{
						id: 2,
						label: 'Project 1 name',
					},
					{
						id: 3,
						label: 'Project 2 Looooooooong name',
					},
					{
						id: 4,
						label: 'With custom handler',
						onClick: () => alert('Add new project action'), // eslint-disable-line no-alert
					},
				]}
			/>
		</ReduxFormInput>
	))
	.add('with object as a value', () => (
		<ReduxFormInput defaultValue={{ id: 1, label: 'None' }}>
			<Select
				items={[
					{
						id: 1,
						label: 'None',
					},
					{
						id: 2,
						label: 'Project 1 name',
					},
					{
						id: 3,
						label: 'Project 2 Looooooooong name',
					},
				]}
				useObjAsValue
			/>
		</ReduxFormInput>
	))
	.add('with custom item rendere', () => (
		<ReduxFormInput defaultValue={1}>
			<Select
				items={[
					{
						id: 1,
						label: 'None',
					},
					{
						id: 2,
						label: 'Project 1 name',
					},
					{
						id: 3,
						label: 'Project 2 Looooooooong name',
					},
				]}
				itemRenderer={customItemRenderer}
			/>
		</ReduxFormInput>
	))
	.add('with popover dismiss flag', () => (
		<ReduxFormInput defaultValue={1}>
			<Select
				items={[
					{
						id: 1,
						label: 'None',
						popoverDismiss: true,
					},
					{
						id: 2,
						label: 'Project 1 name',
						popoverDismiss: true,
					},
					{
						id: 3,
						label: 'Project 2 Looooooooong name',
						popoverDismiss: true,
					},
				]}
			/>
		</ReduxFormInput>
	))
	.add('with wrong value', () => (
		<ReduxFormInput defaultValue={4}>
			<Select
				items={[
					{
						id: 1,
						label: 'None',
						popoverDismiss: true,
					},
					{
						id: 2,
						label: 'Project 1 name',
						popoverDismiss: true,
					},
					{
						id: 3,
						label: 'Project 2 Looooooooong name',
						popoverDismiss: true,
					},
				]}
			/>
		</ReduxFormInput>
	));
