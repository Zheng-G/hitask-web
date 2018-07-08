import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { findAlert } from '@hitask/utils/helpers';
import { ReminderOptions, CustomReminderOption, ReminderTimeType } from '@hitask/constants/item';
import Select from '../FormControls/Select';
import { FieldsArrayShape, FieldMetaShape } from '../FormControls/common';
import classes from './ItemReminderSelector.scss';

const filterDisabledOptions = (selectedOptions, allOptions, startDateDefined) =>
	allOptions.map(option => {
		const selectedOption = findAlert(option, selectedOptions);
		option.disabled = selectedOption ? true : !startDateDefined;
		return option;
	});

// TODO: localize button text and option labels
const ItemAlerts = ({ fields, meta, openCustomReminderDialog, startDateDefined }) => {
	const filteredOptions = filterDisabledOptions(
		fields.getAll(),
		ReminderOptions,
		startDateDefined
	);
	const availableOption = filteredOptions.find(option => !option.disabled);
	return (
		<div>
			<ul className={classes.list}>
				{fields.map((alertName, index) => {
					const alert = fields.get(index);
					const isCustom = alert.timeType === ReminderTimeType.EXACT_TIME;
					const items = [
						{
							label: 'None',
							onClick: () => fields.remove(index),
						},
					]
						.concat(filteredOptions)
						.concat([
							{
								...CustomReminderOption,
								label: isCustom ? alert.label : CustomReminderOption.label,
								onClick: () =>
									openCustomReminderDialog(meta.form, index, alert.timeSpecified),
							},
						])
						.map((item, idx) => {
							item.popoverDismiss = true;
							item.id = item.id || idx;
							return item;
						});
					return (
						<li className={classes.alert} key={alertName}>
							<Field
								name={alertName}
								component={Select}
								items={items}
								useObjAsValue
							/>
						</li>
					);
				})}
				<li className={classes.button}>
					<a
						href={null}
						onClick={() =>
							availableOption
								? fields.push(availableOption)
								: openCustomReminderDialog(meta.form, -1)
						}
						className={classes.buttonLink}
					>
						Add reminder
					</a>
				</li>
			</ul>
		</div>
	);
};

// rerenderOnEveryChange is required - changes in one field effect on available items in other fields
const ItemReminderSelector = props => (
	<FieldArray name="alerts" component={ItemAlerts} rerenderOnEveryChange {...props} />
);

const { func, bool } = PropTypes;
ItemAlerts.propTypes = {
	fields: FieldsArrayShape.isRequired,
	meta: FieldMetaShape.isRequired,
	openCustomReminderDialog: func.isRequired,
	startDateDefined: bool.isRequired,
};

export default ItemReminderSelector;
