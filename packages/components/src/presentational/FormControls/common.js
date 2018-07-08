import PropTypes from 'prop-types';

const { string, boolean, func, shape, number, bool } = PropTypes;

export const FieldInputShape = shape({
	checked: boolean,
	name: string,
	onBlur: func,
	onChange: func,
	onDragStart: func,
	onDrop: func,
	onFocus: func,
});

export const FieldMetaShape = shape({
	active: boolean,
	form: string,
});

export const FieldsArrayShape = shape({
	map: func,
	push: func,
	remove: func,
});

export const SelectOptionShape = shape({
	id: number,
	label: string,
	disabled: bool,
	onClick: func,
});

/*
 * Convert array of tags to string
 */
export const parseTagInputField = (arr = []) => arr.filter(tag => !!tag).join(',');

/*
 * Convert string with tags to array
 */
export const formatTagInputField = (str = '') => str.split(',').filter(tag => !!tag);

/*
 * Convert array of ids to string
 */
export const parseMultiSelectField = parseTagInputField;

/*
 * Convert string with option ids to array
 */
export const formatMultiSelectField = (str = '') =>
	str
		.split(',')
		.filter(tag => !!tag)
		.map(strVal => parseInt(strVal, 10));

export const parseTagSearchInputField = ({ tags, text }) => {
	const tagsStr = tags.map(tag => `__#${tag}`).join(' ');
	return `${tagsStr}${tagsStr.length ? ' ' : ''}${text}`;
};

export const formatTagSearchInputField = strQuery => {
	const matches = strQuery.match(/__#(\S*)/gm) || [];
	const tags = matches.map(match => match.replace('__#', ''));
	const text = matches.reduce(
		(acc, match) => acc.replace(`${match} `, '').replace(match, ''),
		strQuery
	);
	return {
		tags,
		text,
	};
};
