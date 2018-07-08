import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { formatTagSearchInputField, parseTagSearchInputField } from '../FormControls/common';
import TagSearchInput from '../FormControls/TagSearchInput';
import classes from './ItemSearchForm.scss';

const ItemSearchForm = ({ onReset, hidden, tags }) => (
	<form
		onSubmit={e => e.preventDefault()}
		autoComplete="off"
		className={classNames('full-width', {
			hidden,
		})}
	>
		<Field
			name="query"
			component={TagSearchInput}
			parse={parseTagSearchInputField}
			format={formatTagSearchInputField}
			items={tags}
			inputProps={{
				placeholder: 'Search',
			}}
			groupClassName="full-width"
			className={classes.query}
			onReset={onReset}
		/>
	</form>
);

const { func, bool, arrayOf, string } = PropTypes;
ItemSearchForm.propTypes = {
	onReset: func,
	tags: arrayOf(string),
	hidden: bool,
};

const emptyFunc = () => {};
ItemSearchForm.defaultProps = {
	onReset: emptyFunc,
	tags: [],
	hidden: false,
};

export default ItemSearchForm;
