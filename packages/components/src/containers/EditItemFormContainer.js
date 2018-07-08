/**
 * HOC for <ItemFormContainer>
 * Pass item editing functionality to the form
 */
import { connect } from 'react-redux';
import { SubmissionError, formValueSelector } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _values from 'lodash/values';
import _clone from 'lodash/clone';
import {
	EDIT_ITEM_FORM,
	editItem,
	itemSelector,
	formatFormItem,
	formItemDiffSelector,
	actualItemSelfPermissionSelector,
	itemOwnerNameSelector,
} from '@hitask/modules/items';
import { teammatesProfilesSelector } from '@hitask/modules/user';
import { Toaster, ItemEditSuccessToast } from '@hitask/utils/Toasts';
import { validateItemForm } from '@hitask/utils/formValidation';
import { ItemFormDefaultValues, PermissionLevels } from '@hitask/constants/item';
import { ValidationErrors } from '@hitask/constants/errors';
import ItemFormContainer from './ItemFormContainer';

const formSelector = formValueSelector(EDIT_ITEM_FORM);
const initValuesSelectorFactory = itemId => {
	const editingItemSelector = state => itemSelector(state, itemId);
	return createSelector([editingItemSelector], originItem => {
		const item = formatFormItem(originItem);
		return Object.keys(ItemFormDefaultValues).reduce((acc, field) => {
			acc[field] = _clone(item[field] || ItemFormDefaultValues[field]);
			return acc;
		}, {});
	});
};

const mapActionCreators = {};

const mapStateToProps = (initState, { itemId, closeForm }) => {
	const initValuesSelector = initValuesSelectorFactory(itemId);
	if (!itemId) {
		return () => ({
			category: 0,
			submitBtnText: I18n.t(__T('js.task.save_button')),
			itemOwnerName: '',
			// ReduxForm props:
			form: EDIT_ITEM_FORM,
			initialValues: {},
			selfPermissionLevel: 0,
			onSubmitSuccess() {},
			onSubmit() {},
		});
	}

	return state => {
		const initialValues = initValuesSelector(state);
		const itemValues = formSelector(state, ...Object.keys(ItemFormDefaultValues));
		const formItem = Object.keys(ItemFormDefaultValues).reduce((acc, key) => {
			acc[key] = itemValues[key] === undefined ? initialValues[key] : itemValues[key];
			return acc;
		}, {});
		const changedData = formItemDiffSelector(state, formItem, itemId);
		const nothingChanged = !changedData;
		const teammatesNames = teammatesProfilesSelector(state);
		return {
			category:
				formValueSelector(EDIT_ITEM_FORM)(state, 'category') || initialValues.category,
			nothingChanged,
			submitBtnText: I18n.t(__T('js.task.save_button')),
			itemOwnerName: itemOwnerNameSelector(state, itemId, teammatesNames),
			// ReduxForm props:
			form: EDIT_ITEM_FORM,
			initialValues,
			selfPermissionLevel: actualItemSelfPermissionSelector(state, itemId),
			onSubmitSuccess(result, dispatch, props) {
				if (result && result.error) return; // TODO: handle error
				Toaster.show(ItemEditSuccessToast());
				props.reset();
				closeForm();
			},
			onSubmit: (values, dispatch) => {
				const permissionLevel = actualItemSelfPermissionSelector(state, itemId);
				if (permissionLevel < PermissionLevels.MODIFY.id) {
					throw new SubmissionError({ permission: ValidationErrors.NOT_PERMITTED });
				}
				const errors = validateItemForm(values);
				if (_values(errors).some(err => !!err)) {
					throw new SubmissionError(errors);
				}
				if (nothingChanged) return null;
				return dispatch(editItem({ itemId, changedData }));
			},
		};
	};
};

export default connect(mapStateToProps, mapActionCreators)(ItemFormContainer);
