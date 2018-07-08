import React from 'react';
import EditItemDialog from '../../containers/Dialogs/EditItemDialogContainer';
import RecurringOverlay from '../../containers/RecurringOverlayContainer';
import CustomReminderDialog from '../../containers/Dialogs/CustomReminderDialogContainer';
import ParentItemAccessDialog from '../../containers/Dialogs/ParentItemAccessDialogContainer';

const ItemFormDialogs = () => (
	<div>
		<EditItemDialog />
		<CustomReminderDialog />
		<ParentItemAccessDialog />
		<RecurringOverlay />
	</div>
);

export default ItemFormDialogs;
