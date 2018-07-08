import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ReduxFormInput from '../../Catalog/ReduxFormInput';
import FlexDecorator from '../../Catalog/FlexDecorator';
import PrincipalLevelSelect from './PrincipalLevelSelect';
import PrincipalSharingInput from './PrincipalSharingInput';

const levels = [
	{
		id: 20,
		label: 'View, Comment',
	},
	{
		id: 50,
		label: 'Complete, Assign',
	},
	{
		id: 60,
		label: 'Modify',
	},
	{
		id: 100,
		label: 'Everything',
	},
];
const selfId = '11111'; // Pass id in string type for easy comparison with everyoneId
const everyoneId = 'asd-asd-asd';

storiesOf('Item Form/PrincipalLevelSelect', module)
	.add('default', () => (
		<ReduxFormInput defaultValue={100}>
			<PrincipalLevelSelect
				id="12345"
				label="Alexey Mironenko"
				avatarUrl="https://testask.com/avatar/1c1fc3fc-f23c-4b25-9e80-b033f65df9e2.22.png"
				levels={levels}
			/>
		</ReduxFormInput>
	))
	.add('disabled', () => (
		<ReduxFormInput defaultValue={100}>
			<PrincipalLevelSelect
				id="12345"
				label="Alexey Mironenko"
				avatarUrl="https://testask.com/avatar/1c1fc3fc-f23c-4b25-9e80-b033f65df9e2.22.png"
				levels={levels}
				disabled
			/>
		</ReduxFormInput>
	));

storiesOf('Item Form/PrincipalSharingInput', module)
	.addDecorator(FlexDecorator)
	.add('default', () => (
		<ReduxFormInput
			defaultValue={[
				{
					principal: selfId, // selfId, will not be visible
					level: 100,
				},
			]}
			onChange={action('change')}
		>
			<PrincipalSharingInput
				principals={[
					{
						id: everyoneId,
						label: 'Everyone',
						iconName: 'people',
					},
					{
						id: selfId,
						label: 'Current User',
					},
					{
						id: '12345',
						label: 'Alexey Mironenko',
						avatarUrl:
							'https://testask.com/avatar/1c1fc3fc-f23c-4b25-9e80-b033f65df9e2.22.png',
					},
					{
						id: '12346',
						label: 'User 2',
					},
					{
						id: '12347',
						label: 'Firstname Lastname',
					},
				]}
				levels={levels}
				defaultLevel={50}
				selfId={selfId}
				everyoneId={everyoneId}
				className="custom-class"
				tagInputProps={{
					placeholder: 'Type here',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with initial value', () => (
		<ReduxFormInput
			defaultValue={[
				{
					principal: '12346', // Item owner
					level: 100,
				},
				{
					principal: everyoneId,
					level: 100,
				},
			]}
			onChange={action('change')}
		>
			<PrincipalSharingInput
				principals={[
					{
						id: everyoneId,
						label: 'Everyone',
						iconName: 'people',
					},
					{
						id: selfId,
						label: 'Current User',
					},
					{
						id: '12345',
						label: 'Alexey Mironenko',
						avatarUrl:
							'https://testask.com/avatar/1c1fc3fc-f23c-4b25-9e80-b033f65df9e2.22.png',
					},
					{
						id: '12346',
						label: 'User 2',
						disabled: true, // Item owner permission must be immutable
					},
					{
						id: '12347',
						label: 'Firstname Lastname',
					},
				]}
				levels={levels}
				defaultLevel={50}
				selfId={selfId}
				everyoneId={everyoneId}
				className="custom-class"
				tagInputProps={{
					placeholder: 'Type here',
				}}
			/>
		</ReduxFormInput>
	))
	.add('with wrong value', () => (
		<ReduxFormInput
			defaultValue={[
				{
					principal: '100000', // this principal is absent among 'principals'
					level: 100,
				},
			]}
			onChange={action('change')}
		>
			<PrincipalSharingInput
				principals={[
					{
						id: everyoneId,
						label: 'Everyone',
						iconName: 'people',
					},
					{
						id: '12344',
						label: 'Current User',
					},
					{
						id: '12345',
						label: 'Alexey Mironenko',
						avatarUrl:
							'https://testask.com/avatar/1c1fc3fc-f23c-4b25-9e80-b033f65df9e2.22.png',
					},
					{
						id: '12346',
						label: 'User 2',
					},
					{
						id: '12347',
						label: 'Firstname Lastname',
					},
				]}
				levels={levels}
				defaultLevel={50}
				selfId="12344"
				everyoneId={everyoneId}
				className="custom-class"
				tagInputProps={{
					placeholder: 'Type here',
				}}
			/>
		</ReduxFormInput>
	));
