import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import TagInputSuggest from '../FormControls/TagInputSuggest';
import { parseTagInputField, formatTagInputField } from '../FormControls/common';
import classes from './ItemTagsSelector.scss';

// FIXME localize placeholder
const ItemTagsSelector = ({ tags }) => (
	<Field
		name="tags"
		component={TagInputSuggest}
		parse={parseTagInputField}
		format={formatTagInputField}
		groupClassName={classes.selector}
		items={tags}
		inputProps={{
			placeholder: 'Add tags',
		}}
	/>
);

const { arrayOf, string } = PropTypes;
ItemTagsSelector.propTypes = {
	tags: arrayOf(string),
};

ItemTagsSelector.defaultProps = {
	tags: [],
};

export default ItemTagsSelector;
