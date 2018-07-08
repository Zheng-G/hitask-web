import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import SelectSuggest from '../FormControls/SelectSuggest';
import classes from './ItemProjectSelector.scss';

class ItemProjectSelector extends React.PureComponent {
	render() {
		const { projectsHash } = this.props;
		return (
			<Field
				name="parent"
				component={SelectSuggest}
				items={[].concat(
					Object.keys(projectsHash).map(itemId => ({
						id: projectsHash[itemId].id,
						label: projectsHash[itemId].title,
						iconName: 'folder-close',
						iconColor: projectsHash[itemId].colorValue,
					}))
				)}
				groupClassName={classes.selector}
				inputProps={{
					placeholder: 'Add to project',
				}}
			/>
		);
	}
}

const { shape } = PropTypes;
ItemProjectSelector.propTypes = {
	projectsHash: shape({}).isRequired,
};

export default ItemProjectSelector;
