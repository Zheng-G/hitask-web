import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { Translate } from 'react-redux-i18n';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import { ItemCategories } from '@hitask/constants/item';
import classes from './ItemCategorySelector.scss';

const CategoryOptions = {
	PROJECT: {
		id: ItemCategories.PROJECT,
		label: __T('js.category_0.name'),
		hidden: true,
	},
	TASK: {
		id: ItemCategories.TASK,
		label: __T('js.category_1.name'),
		icon: 'small-tick',
	},
	EVENT: {
		id: ItemCategories.EVENT,
		label: __T('js.category_2.name'),
		icon: 'time',
	},
	NOTE: {
		id: ItemCategories.NOTE,
		label: __T('js.category_4.name'),
		icon: 'document',
	},
	// FILE: {
	// 	id: ItemCategories.FILE,
	// 	label: __T('js.category_5.name'),
	// 	icon: 'link'
	// },
	// MULTIPLE: {
	// 	id: 10,
	// 	label: 'many tasks',
	// 	icon: 'duplicate'
	// }
};

const ItemCategorySelector = ({ category, form }) => (
	<div className={classes.selector}>
		{Object.keys(CategoryOptions).map(
			key =>
				!CategoryOptions[key].hidden && (
					<label
						className={classNames(classes.option, {
							[classes.activeOption]: category === CategoryOptions[key].id,
						})}
						htmlFor={`${form}-category-${CategoryOptions[key].id}`}
						key={CategoryOptions[key].id}
					>
						<Field
							name="category"
							id={`${form}-category-${CategoryOptions[key].id}`}
							component="input"
							type="radio"
							value={CategoryOptions[key].id}
							parse={strVal => parseInt(strVal, 10)}
						/>
						{CategoryOptions[key].icon && (
							<span
								className={classNames(
									BpClasses.ICON_STANDARD,
									BpClasses.iconClass(CategoryOptions[key].icon)
								)}
							/>
						)}
						<Translate value={CategoryOptions[key].label} />
					</label>
				)
		)}
	</div>
);

const { number, string } = PropTypes;
ItemCategorySelector.propTypes = {
	category: number,
	form: string.isRequired,
};

ItemCategorySelector.defaultProps = {
	category: 1,
};

export default ItemCategorySelector;
