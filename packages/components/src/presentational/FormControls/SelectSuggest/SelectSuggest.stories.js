/* eslint react/prop-types:0 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import FlexDecorator from '../../Catalog/FlexDecorator';
import SelectSuggest from './SelectSuggest';

const customItemRenderer = ({ handleClick, isActive, isSelected, item }) => (
	<div key={item.id}>
		<button onClick={handleClick} key={item.id}>
			{`${isSelected ? 'Selected ' : ''}${isActive ? 'active ' : ''}${item.label}`}
		</button>
	</div>
);

storiesOf('Simple/SelectSuggest', module)
	.addDecorator(FlexDecorator)
	.add('default', () => (
		<ReduxFormInput defaultValue={0}>
			<SelectSuggest
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
				inputProps={{
					placeholder: 'Enter name',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with initial value', () => (
		<ReduxFormInput defaultValue={101}>
			<SelectSuggest
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
				inputProps={{
					placeholder: 'Enter name',
				}}
				className="custom-class"
			/>
		</ReduxFormInput>
	))
	.add('with custom handler', () => (
		<ReduxFormInput defaultValue={3}>
			<SelectSuggest
				items={[
					{
						id: 1,
						label: 'None',
					},
					{
						id: 2,
						label: 'Label 1',
					},
					{
						id: 3,
						label: 'Label 2 Looooooooong name',
					},
					{
						id: 4,
						label: 'Custom handler',
						onClick: () => alert('Add new project action'), // eslint-disable-line no-alert
					},
				]}
			/>
		</ReduxFormInput>
	))
	.add('with object as a value', () => (
		<ReduxFormInput defaultValue={{ id: 1, label: 'None' }}>
			<SelectSuggest
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
	.add('with custom item render', () => (
		<ReduxFormInput defaultValue={1}>
			<SelectSuggest
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
	.add('with wrong value', () => (
		<ReduxFormInput defaultValue={4}>
			<SelectSuggest
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
			/>
		</ReduxFormInput>
	));
