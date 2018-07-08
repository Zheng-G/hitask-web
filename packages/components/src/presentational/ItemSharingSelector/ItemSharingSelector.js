import React from 'react';
import { Field } from 'redux-form';
import PrincipalSharingInput from '../FormControls/PrincipalSharingInput';
import classes from './ItemSharingSelector.scss';

class ItemSharingSelector extends React.PureComponent {
	render() {
		return (
			<Field
				name="permissions"
				component={PrincipalSharingInput}
				groupClassName={classes.selector}
				tagInputProps={{
					placeholder: 'Share item...',
				}}
				{...this.props}
			/>
		);
	}
}

export default ItemSharingSelector;
