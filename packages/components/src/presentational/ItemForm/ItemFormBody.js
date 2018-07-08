import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { Icon } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import ModifyDateTime from '../../containers/ModifyDateTimeContainer';
import ItemReminderSelector from '../../containers/ItemReminderSelectorContainer';
import ItemSharingSelector from '../../containers/ItemSharingSelectorContainer';
import ItemAssigneeSelector from '../../containers/ItemAssigneeSelectorContainer';
import ItemParticipantsSelector from '../../containers/ItemParticipantsSelectorContainer';
import ItemCategorySelector from '../../containers/ItemCategorySelectorContainer';
import ItemProjectSelector from '../../containers/ItemProjectSelectorContainer';
import ItemTagsSelector from '../../containers/ItemTagsSelectorContainer';
import ItemDescriptionInput from '../ItemDescriptionInput';
import ItemPrioritySelector from '../ItemPrioritySelector';
import formLayoutClasses from '../FormLayout';
import { FormFields, isFieldVisible } from './common';

const iconRowClass = classNames(formLayoutClasses.row, formLayoutClasses.iconLabeled);

class ItemFormBody extends PureComponent {
	render() {
		const { form, category, hidden, isSubitem, selfPermissionLevel } = this.props;
		logRender(`render ItemFormBody (${form})`);
		return (
			<div className={classNames({ hidden })}>
				{isFieldVisible(FormFields.MESSAGE, { category, form }) && (
					<div className={formLayoutClasses.row} style={{ lineHeight: '2.2rem' }}>
						<Field name="message" component={ItemDescriptionInput} />
					</div>
				)}

				{isFieldVisible(FormFields.CATEGORY, { category, form }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel} />
						<div className={formLayoutClasses.rowContent}>
							<ItemCategorySelector form={form} />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.ASSIGNEE, { category, form }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="person" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ItemAssigneeSelector />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.PARTICIPANTS, { category, form }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="people" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ItemParticipantsSelector />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.DATE_TIME_REPEAT, { category, form }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="calendar" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ModifyDateTime form={form} />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.REMINDER, { category, form }) && (
					<div className={classNames(iconRowClass, formLayoutClasses.alignStart)}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="notifications" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ItemReminderSelector form={form} />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.TAGS, { category, form }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="tag" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ItemTagsSelector />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.SHARING, { category, form, selfPermissionLevel }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="lock" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ItemSharingSelector form={form} />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.PROJECT, { category, form, isSubitem }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel}>
							<Icon iconName="folder-close" />
						</div>
						<div className={formLayoutClasses.rowContent}>
							<ItemProjectSelector />
						</div>
					</div>
				)}

				{isFieldVisible(FormFields.PRIORITY, { category, form }) && (
					<div className={iconRowClass}>
						<div className={formLayoutClasses.rowLabel} />
						<div className={formLayoutClasses.rowContent}>
							<ItemPrioritySelector />
						</div>
					</div>
				)}
			</div>
		);
	}
}

const { number, bool, string } = PropTypes;
ItemFormBody.propTypes = {
	form: string.isRequired,
	category: number.isRequired,
	isSubitem: bool.isRequired,
	hidden: bool.isRequired,
	selfPermissionLevel: number.isRequired,
};

export default ItemFormBody;
