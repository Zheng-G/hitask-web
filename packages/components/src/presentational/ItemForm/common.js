import { EDIT_ITEM_FORM, ADD_SUBITEM_FORM } from '@hitask/modules/items';
import { ItemCategories, PermissionLevels } from '@hitask/constants/item';

export const FormFields = {
	TITLE: 'TITLE',
	STAR: 'STAR',
	MESSAGE: 'MESSAGE',
	CATEGORY: 'CATEGORY',
	DATE_TIME_REPEAT: 'DATE_TIME_REPEAT',
	REMINDER: 'REMINDER',
	SHARING: 'SHARING',
	ASSIGNEE: 'ASSIGNEE',
	PARTICIPANTS: 'PARTICIPANTS',
	PROJECT: 'PROJECT',
	PRIORITY: 'PRIORITY',
	TAGS: 'TAGS',
	COLOR: 'COLOR',
};

export const FormFieldsConfig = {
	[FormFields.TITLE]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: false,
	},
	[FormFields.STAR]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.MESSAGE]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.CATEGORY]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.DATE_TIME_REPEAT]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: false,
		[ItemCategories.FILE]: false,
	},
	[FormFields.REMINDER]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: false,
		[ItemCategories.FILE]: false,
	},
	[FormFields.SHARING]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.ASSIGNEE]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.PARTICIPANTS]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.PROJECT]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.PRIORITY]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.TAGS]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
	[FormFields.COLOR]: {
		[ItemCategories.TASK]: true,
		[ItemCategories.EVENT]: true,
		[ItemCategories.NOTE]: true,
		[ItemCategories.FILE]: true,
	},
};

export const isFieldVisible = (
	fieldName,
	{ category, form, isSubitem, selfPermissionLevel = 0 }
) => {
	switch (fieldName) {
		case FormFields.CATEGORY:
			return form === EDIT_ITEM_FORM ? false : FormFieldsConfig[fieldName][category];
		case FormFields.SHARING:
			return selfPermissionLevel < PermissionLevels.EVERYTHING.id || form === ADD_SUBITEM_FORM
				? false
				: FormFieldsConfig[fieldName][category];
		case FormFields.PROJECT:
			return form === ADD_SUBITEM_FORM || (form === EDIT_ITEM_FORM && isSubitem) // Hide for AddNew and Edit subitems
				? false
				: FormFieldsConfig[fieldName][category];
		default:
			return FormFieldsConfig[fieldName][category];
	}
};
