import { connect } from 'react-redux';
import { reduxForm, change } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import _isEqual from 'lodash/isEqual';
import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import { selfIdSelector, selfProfileSelector } from '@hitask/modules/auth';
import {
	itemSelector,
	itemsSelector,
	checkUserAccessToItemHierarchy,
	iAmItemAdminSelector,
	uploadingSelector,
	isSubitemSelector,
} from '@hitask/modules/items';
import { Overlays, openOverlay, openNoPermissionAlert } from '@hitask/modules/overlays';
import {
	timeZoneSelector,
	everyoneIdSelector,
	teammateProfileSelector,
	defaultNewItemSharingValuesSelector,
} from '@hitask/modules/user';
import {
	RecurTypes,
	ReminderTimeType,
	PermissionLevels,
	ItemFormDefaultValues,
} from '@hitask/constants/item';
import { getDefaultTime } from '@hitask/constants/calendar';
import { ValidationErrors } from '@hitask/constants/errors';
import ItemForm from '../presentational/ItemForm';

export const filteredNewItemSharingValuesSelector = createSelector(
	[selfIdSelector, defaultNewItemSharingValuesSelector],
	(userId, values = ItemFormDefaultValues.permissions) => {
		return values
			.filter(value => value.principal && value.principal.toString() !== userId.toString())
			.map(value => ({
				...value,
				principal: value.principal.toString(),
			}));
	}
);

const showValidationAlert = dispatch => (errors, { closeForm, itemOwnerName }) => {
	if (!errors) return null;
	if (errors.permission === ValidationErrors.NOT_PERMITTED) {
		return dispatch(
			openNoPermissionAlert({
				actionType: I18n.t(__T('js.common.modifyAction')),
				itemOwnerName,
				onClose: closeForm,
			})
		);
	}
	if (errors.title === ValidationErrors.REQUIRED) {
		return dispatch(
			openOverlay({
				name: Overlays.INFO_MESSAGE,
				props: {
					message: I18n.t(__T('js.task.title_required')),
				},
			})
		);
	}
	if (errors.startDate === ValidationErrors.REQUIRED) {
		return dispatch(
			openOverlay({
				name: Overlays.INFO_MESSAGE,
				props: {
					message: I18n.t(__T('js.task.validate.start_date_required')),
				},
			})
		);
	}
	if (errors.endDate === ValidationErrors.LONG_RECUR_DURATION) {
		return dispatch(
			openOverlay({
				name: Overlays.INFO_MESSAGE,
				props: {
					message: I18n.t(__T('js.task.validate.wrong_recurring_duration')),
				},
			})
		);
	}
	if (errors.alerts === ValidationErrors.DUPLICATION) {
		return dispatch(
			openOverlay({
				name: Overlays.INFO_MESSAGE,
				props: {
					// TODO: localize
					message: 'There are duplicates in alerts. Please remove duplicates',
				},
			})
		);
	}
	return null;
};

const openParentAccessDialog = dispatch => props => {
	const { canAdmin, cancelChange } = props;
	// Open dialog with an option to allow user access to parent item
	if (canAdmin) {
		return dispatch(
			openOverlay({
				name: Overlays.PARENT_ITEM_ACCESS,
				props,
			})
		);
	}

	// Open alert that change cannot be applied
	// because `userName` has no access to parent item
	const { userName, parentTitle, field } = props;
	cancelChange();
	return dispatch(
		openOverlay({
			name: Overlays.INFO_MESSAGE,
			props: {
				// TODO: localize
				title:
					field === 'assignee'
						? `Cannot assign to ${userName}`
						: field === 'participants'
							? `Cannot add ${userName} to participants`
							: `Cannot share with ${userName}`,
				message:
					field === 'assignee'
						? `Assignee does not have access to this item's parent "${parentTitle}"`
						: field === 'participants'
							? `Participant does not have access to this item's parent "${parentTitle}"`
							: `User does not have access to this item's parent "${parentTitle}"`,
			},
		})
	);
};

// Check if userId has requiredLevel of access to parentId to change the child item
const checkParentAccess = (state, dispatch) => ({
	userId,
	parentId,
	requiredLevel = PermissionLevels.VIEW_COMMENT.id,
	selfId,
	everyoneId,
	form,
	field,
	prevValues = [],
}) => {
	const highestNonAccessedItemId = checkUserAccessToItemHierarchy(
		itemsSelector(state),
		parentId,
		requiredLevel,
		userId,
		selfId,
		everyoneId
	);
	if (!highestNonAccessedItemId) return;
	const ownerProfile =
		userId === selfId ? selfProfileSelector(state) : teammateProfileSelector(state, userId);
	if (!ownerProfile) {
		console.error(`Failed checkParentAccess: Unknown user ${userId}`);
		return;
	}
	openParentAccessDialog(dispatch)({
		userId,
		userName: ownerProfile.name,
		parentId: highestNonAccessedItemId,
		level: requiredLevel,
		parentTitle: itemSelector(state, highestNonAccessedItemId).title,
		canAdmin: iAmItemAdminSelector(state, highestNonAccessedItemId),
		field,
		cancelChange() {
			Object.keys(prevValues).forEach(fieldName => {
				dispatch(change(form, fieldName, prevValues[fieldName]));
			});
		},
	});
};

const mapActionCreators = {};

const mapStateToProps = (state, { form, itemId }) => ({
	isSubitem: itemId ? isSubitemSelector(state, itemId) : false,
	locked: uploadingSelector(state),
	// ReduxForm props:
	onSubmitFail(errors, dispatch, submitError, props) {
		showValidationAlert(dispatch)(errors, props);
	},
	onChange(values, dispatch, props, previousValues) {
		// Values.startDate, values.startTime, values.endDate, values.endTime are type of string here
		// Convert them using moment()
		const timeZone = timeZoneSelector(state);
		const selfId = selfIdSelector(state);
		const everyoneId = everyoneIdSelector(state);

		// ---------------------------------------
		// DateTime validation:
		// ---------------------------------------
		if (values.recurType !== RecurTypes.NONE && !values.startDate) {
			dispatch(
				change(
					form,
					'startDate',
					moment()
						.startOf('day')
						.tz(timeZone)
						.format()
				)
			);
			if (values.isAllDay !== true) dispatch(change(form, 'isAllDay', true));
		}
		if (!values.startDate && values.startTime) {
			dispatch(change(form, 'startTime', null));
		}
		if (!values.endDate && values.endTime) {
			dispatch(change(form, 'endTime', null));
		}
		if (values.isAllDay) {
			// Reset time fields if isAllDay is true
			if (values.startTime !== null) dispatch(change(form, 'startTime', null));
			if (values.endTime !== null) dispatch(change(form, 'endTime', null));
		} else {
			// Fill missing time fields
			if (values.startDate && !values.startTime) {
				dispatch(change(form, 'startTime', getDefaultTime().format()));
			}
			if (values.endDate && !values.endTime) {
				dispatch(
					change(
						form,
						'endTime',
						values.startTime
							? moment(values.startTime)
									.add(1, 'hour')
									.format()
							: getDefaultTime()
									.add(1, 'hour')
									.format()
					)
				);
			}
		}
		if (!values.startDate && values.alerts) {
			// Relative alerts available only with startDate
			const filteredAlerts = values.alerts.filter(
				alert => alert.timeType === ReminderTimeType.EXACT_TIME
			);
			if (!_isEqual(values.alerts, filteredAlerts))
				dispatch(change(form, 'alerts', filteredAlerts));
		}

		// ---------------------------------------
		// Team sharing validation:
		// ---------------------------------------
		const prevValues = {
			permissions: previousValues.permissions,
			assignee: previousValues.assignee,
			participants: previousValues.participants,
			parent: previousValues.parent,
		};
		if (values.parent && values.permissions) {
			// Check are shared users have access to parent item
			const permissions = values.permissions.map(perm => {
				if (perm.principal === everyoneId) return perm;
				return {
					...perm,
					principal: parseInt(perm.principal, 10), // Parse non-everyone principals
				};
			});
			permissions.forEach(({ principal }) => {
				checkParentAccess(state, dispatch)({
					userId: principal,
					parentId: values.parent,
					selfId,
					everyoneId,
					form,
					field: 'permissions',
					prevValues,
				});
			});
		}
		if (values.parent && values.assignee) {
			// Check is assignee has access to parent item
			checkParentAccess(state, dispatch)({
				userId: values.assignee,
				parentId: values.parent,
				selfId,
				everyoneId,
				form,
				field: 'assignee',
				prevValues,
			});
		}
		if (values.parent && values.participants) {
			// Check is assignee has access to parent item
			const participants = values.participants.split(',').map(str => parseInt(str, 10));
			participants.forEach(userId => {
				checkParentAccess(state, dispatch)({
					userId,
					parentId: values.parent,
					selfId,
					everyoneId,
					form,
					field: 'participants',
					prevValues,
				});
			});
		}
	},
});

const ItemFormWrapped = reduxForm({
	// onChange - mapped from mapStateToProps
	// form - mapped from parent mapStateToProps
	// initialValues - mapped from parent mapStateToProps
	// onSubmit - mapped from parent mapStateToProps
	// onSubmitSuccess - mapped from parent mapStateToProps
})(ItemForm);

export default connect(mapStateToProps, mapActionCreators)(ItemFormWrapped);
