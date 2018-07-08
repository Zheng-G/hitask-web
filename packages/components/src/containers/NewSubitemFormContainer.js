/**
 * HOC for <ItemFormContainer>
 * Pass subitem adding functionality to the form
 */
import { connect } from 'react-redux';
import { SubmissionError, formValueSelector } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { createSelector } from 'reselect';
import _values from 'lodash/values';
import { selfIdSelector } from '@hitask/modules/auth';
import { ADD_SUBITEM_FORM, addItem } from '@hitask/modules/items';
import { toggleNewSubitemForm } from '@hitask/modules/tabs';
import { Toaster, ItemAddedSuccessToast } from '@hitask/utils/Toasts';
import { validateItemForm } from '@hitask/utils/formValidation';
import { ItemFormDefaultValues, PermissionLevels } from '@hitask/constants/item';
import ItemFormContainer from './ItemFormContainer';

const initValuesSelectorFactory = parentItemId =>
	createSelector([selfIdSelector], userId => {
		return {
			...Object.keys(ItemFormDefaultValues).reduce((acc, field) => {
				acc[field] = ItemFormDefaultValues[field];
				return acc;
			}, {}),
			userId,
			parent: parentItemId,
		};
	});

const mapActionCreators = {};

const mapStateToProps = (
	initState,
	{ parentItemId, closeForm, scrollToParentTop, forbidAttach }
) => {
	const initValuesSelector = initValuesSelectorFactory(parentItemId);
	return state => {
		const initialValues = initValuesSelector(state);
		return {
			category:
				formValueSelector(ADD_SUBITEM_FORM)(state, 'category') || initialValues.category,
			submitBtnText: I18n.t(__T('js.common.add')),
			selfPermissionLevel: PermissionLevels.EVERYTHING.id,
			// ReduxForm props:
			form: ADD_SUBITEM_FORM,
			initialValues,
			onSubmitSuccess(result, dispatch, props) {
				if (result && result.error) return; // TODO: handle error
				if (forbidAttach) {
					Toaster.show(ItemAddedSuccessToast());
				} else {
					Toaster.show(
						ItemAddedSuccessToast({
							openCreateForm() {
								dispatch(toggleNewSubitemForm({ itemId: parentItemId }));
							},
						})
					);
				}
				props.reset();
				closeForm();
				scrollToParentTop();
			},
			onSubmit(values, dispatch) {
				const errors = validateItemForm(values);
				if (_values(errors).some(err => !!err)) {
					throw new SubmissionError(errors);
				}
				return dispatch(addItem(values));
			},
			enableReinitialize: true,
		};
	};
};

export default connect(mapStateToProps, mapActionCreators)(ItemFormContainer);
