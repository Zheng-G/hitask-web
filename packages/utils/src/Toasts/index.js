import { I18n } from 'react-redux-i18n';
import { Intent } from '@hitask/blueprint-core';
import Toaster from './Toaster';

const timeout = 4000;

export const ItemAddedSuccessToast = ({ openCreateForm } = {}) => ({
	message: I18n.t(__T('js.notification.item_added')),
	iconName: 'tick',
	intent: Intent.PRIMARY,
	timeout,
	action: openCreateForm
		? {
				text: I18n.t(__T('js.task.add_more')),
				onClick: openCreateForm,
		  }
		: null,
});

export const ItemEditSuccessToast = () => ({
	message: I18n.t(__T('js.notification.task_modified')),
	iconName: 'tick',
	intent: Intent.PRIMARY,
	timeout,
});

export const ItemCompletedToast = () => ({
	message: I18n.t(__T('js.notification.item_completed')),
	iconName: 'tick',
	intent: Intent.PRIMARY,
	timeout,
});

export const ItemUncompletedToast = () => ({
	message: I18n.t(__T('js.notification.item_restored')),
	iconName: 'tick',
	timeout,
});

export { Toaster };
