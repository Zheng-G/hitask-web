/**
 * HOC for <ItemFormContainer>
 * Pass item adding functionality to the form
 */
import { connect } from 'react-redux';
import { SubmissionError, formValueSelector } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _values from 'lodash/values';
import { selfIdSelector } from '@hitask/modules/auth';
import { ADD_ITEM_FORM, addItem } from '@hitask/modules/items';
import { toggleCreateForm } from '@hitask/modules/layout';
import { Toaster, ItemAddedSuccessToast } from '@hitask/utils/Toasts';
import { validateItemForm } from '@hitask/utils/formValidation';
import { ItemFormDefaultValues, PermissionLevels } from '@hitask/constants/item';
import ItemFormContainer, { filteredNewItemSharingValuesSelector } from './ItemFormContainer';

const formSelector = formValueSelector(ADD_ITEM_FORM);
const initValuesSelector = createSelector(
	[selfIdSelector, filteredNewItemSharingValuesSelector],
	(userId, permissions) => {
		return {
			...Object.keys(ItemFormDefaultValues).reduce((acc, field) => {
				acc[field] = ItemFormDefaultValues[field];
				return acc;
			}, {}),
			userId,
			permissions,
		};
	}
);

const mapActionCreators = {};

let firstRun = true;
const mapStateToProps = state => {
	const initialValues = initValuesSelector(state);
	// Form must not be reinitialized on first render to preserve existing values in state.form.ADD_ITEM_FORM.values
	const enableReinitialize = !firstRun;
	firstRun = false;
	return {
		category: formSelector(state, 'category') || initialValues.category,
		submitBtnText: I18n.t(__T('js.common.add')),
		selfPermissionLevel: PermissionLevels.EVERYTHING.id,
		fixedHeight: true,
		// ReduxForm props:
		form: ADD_ITEM_FORM,
		initialValues,
		onSubmitSuccess(result, dispatch, props) {
			if (result && result.error) return; // TODO: handle error
			Toaster.show(
				ItemAddedSuccessToast({
					openCreateForm() {
						dispatch(toggleCreateForm({ isOpen: true }));
					},
				})
			);
			props.reset();
			dispatch(toggleCreateForm({ isOpen: false }));
		},
		onSubmit(values, dispatch) {
			const errors = validateItemForm(values);
			if (_values(errors).some(err => !!err)) {
				throw new SubmissionError(errors);
			}
			return dispatch(addItem(values));
		},
		enableReinitialize,
	};
};

export default connect(mapStateToProps, mapActionCreators)(ItemFormContainer);
