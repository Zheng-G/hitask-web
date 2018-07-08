import React from 'react';

const size16 = {
	width: 16,
	height: 16,
};
const size30 = {
	width: 30,
	height: 30,
};
const size32 = {
	width: 32,
	height: 32,
};
const defaultSize = size16;

const IconsConfig = {
	all: [
		{
			name: 'Google',
			path: 'Google.svg',
			size: size32,
		},
		{
			name: 'HitaskSymbol',
			path: 'HitaskSymbol.svg',
			size: size32,
		},
		{
			name: 'HitaskLogo',
			path: 'HitaskLogo.svg',
			size: {
				width: 105,
				height: 25,
			},
		},
	],
	itemList: [
		{
			name: 'ItemEvent',
			path: 'ItemEvent.svg',
		},
		{
			name: 'ItemEventCompleted',
			path: 'ItemEventCompleted.svg',
		},
		{
			name: 'ItemFile',
			path: 'ItemFile.svg',
		},
		{
			name: 'ItemNote',
			path: 'ItemNote.svg',
		},
		{
			name: 'ItemListTask',
			path: 'ItemListTask.svg',
		},
		{
			name: 'ProjectGroupClosed',
			path: 'ProjectGroupClosed.svg',
		},
		{
			name: 'ProjectGroupOpen',
			path: 'ProjectGroupOpen.svg',
		},
		{
			name: 'ItemPriorityHigh',
			path: 'ItemPriorityHigh.svg',
		},
		{
			name: 'ItemPriorityLow',
			path: 'ItemPriorityLow.svg',
		},
		{
			name: 'ItemStar',
			path: 'ItemStar.svg',
		},
		{
			name: 'ItemStarOff',
			path: 'ItemStarOff.svg',
		},
		{
			name: 'EmptyStateItem',
			path: 'EmptyStateItem.svg',
			size: {
				width: 60,
			},
		},
		{
			name: 'IconLink',
			path: 'IconLink.svg',
		},
		{
			name: 'ItemFormStar',
			path: 'ItemFormStar.svg',
		},
		{
			name: 'ItemFormStarOff',
			path: 'ItemFormStarOff.svg',
		},
		{
			name: 'TaskOff',
			path: 'TaskOff.svg',
		},
		{
			name: 'TaskHover',
			path: 'TaskHover.svg',
		},
		{
			name: 'TaskClick',
			path: 'TaskClick.svg',
		},
		{
			name: 'TaskCompleted',
			path: 'TaskCompleted.svg',
		},
		{
			name: 'toolbar-add',
			path: 'toolbar-add.svg',
		},
	],
	itemForm: [
		{
			name: 'NewItemTask',
			path: 'item-new/task.svg',
		},
		{
			name: 'NewItemEvent',
			path: 'item-new/event.svg',
		},
		{
			name: 'NewItemNote',
			path: 'item-new/note.svg',
		},
		{
			name: 'NewItemFile',
			path: 'item-new/file.svg',
		},
		{
			name: 'ItemFormShared',
			path: 'item-form/shared.svg',
		},
		{
			name: 'ItemFormPrivate',
			path: 'item-form/private.svg',
		},
		{
			name: 'ItemFormCalendar',
			path: 'item-form/calendar.svg',
		},
		{
			name: 'ItemHistoryEdit',
			path: 'item-view/history-edit.svg',
		},
	],
	itemAction: [
		{
			name: 'ItemActionAdd',
			path: 'item-action/add.svg',
			size: size30,
		},
		{
			name: 'ItemActionAttach',
			path: 'item-action/attach.svg',
			size: size30,
		},
		{
			name: 'ItemActionDuplicate',
			path: 'item-action/duplicate.svg',
			size: size30,
		},
		{
			name: 'ItemActionDelete',
			path: 'item-action/delete.svg',
			size: size30,
		},
		{
			name: 'ItemActionComment',
			path: 'item-view/comment.svg',
		},
	],
};

const collectGroupIcons = config => {
	return config.map(iconObj => {
		const Icon = require(`@hitask/icons/${iconObj.path}`).default; // eslint-disable-line
		const size = iconObj.size || defaultSize;
		return {
			...iconObj,
			icon: <Icon {...size} {...iconObj.props} />,
		};
	});
};

const IconsCollection = Object.keys(IconsConfig).reduce((acc, groupName) => {
	acc[groupName] = collectGroupIcons(IconsConfig[groupName]);
	return acc;
}, {});

export default IconsCollection;
