/**
 * Reusable form for item adding & editing
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import _isEqualWith from 'lodash/isEqualWith';
import { Button, Intent, Classes as BpClasses, Position } from '@hitask/blueprint-core';
import { EDIT_ITEM_FORM, ADD_SUBITEM_FORM /* , ADD_ITEM_FORM */ } from '@hitask/modules/items';
import { logRender } from '@hitask/utils/debug';
import { TITLE_MAX_LENGTH } from '@hitask/constants/item';
import { KeyCodes } from '@hitask/constants/global';
import TextInput from '../FormControls/TextInput';
import formLayoutClasses from '../FormLayout';
import StarCheckbox from '../FormControls/StarCheckbox';
import ColorPicker from '../FormControls/ColorPicker';
import Spinner from '../Spinner';
import ItemFormBody from './ItemFormBody';
import { FormFields, isFieldVisible } from './common';
import classes from './ItemForm.scss';

const { func, number, bool, string } = PropTypes;
const propTypes = {
	form: string.isRequired,
	handleSubmit: func.isRequired,
	openForm: func,
	closeForm: func.isRequired,
	reset: func.isRequired,
	category: number.isRequired,
	opened: bool,
	className: string,
	disabled: bool,
	locked: bool,
	nothingChanged: bool,
	submitBtnText: string.isRequired,
	isSubitem: bool,
	selfPermissionLevel: number.isRequired,
	fixedHeight: bool,
};
const propNames = Object.keys(propTypes);

class ItemForm extends Component {
	// use class component to enable 'this.titleInput'
	constructor(props) {
		super(props);
		this.maybeOpenForm = this.maybeOpenForm.bind(this);
		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		if (
			_isEqualWith(this.props, nextProps, (currProp, nextProp, propName) => {
				// Ignore props that not used in render. Note: propName can be undefined
				if (propName && !propNames.includes(propName)) return true;
				return undefined;
			})
		)
			return false;
		return true;
	}

	onCancel() {
		this.props.closeForm();
		this.props.reset();
	}

	onSubmit(event) {
		if (this.titleInput) {
			this.titleInput.blur();
		}
		this.props.handleSubmit(event);
	}

	maybeOpenForm(event) {
		const { disabled, opened, openForm } = this.props;
		if (!disabled && !opened && openForm) {
			openForm(event);
		}
	}

	refHandlers = {
		titleInput: ref => {
			this.titleInput = ref;
		},
	};

	render() {
		const {
			className,
			category,
			opened,
			disabled,
			isSubitem,
			fixedHeight,
			form,
			nothingChanged,
			submitBtnText,
			locked,
			selfPermissionLevel,
		} = this.props;
		const isEditForm = form === EDIT_ITEM_FORM;
		const isNewSubitemForm = form === ADD_SUBITEM_FORM;

		logRender(`render ItemForm (${form})`);
		return (
			<form
				onSubmit={this.onSubmit}
				className={classNames(formLayoutClasses.form, classes.form, className, {
					[formLayoutClasses.fixedHeight]: opened && fixedHeight,
					[classes.editForm]: isEditForm,
					[classes.addSubitemForm]: isNewSubitemForm,
					[BpClasses.ELEVATION_3]: isNewSubitemForm,
				})}
				autoComplete="off"
			>
				<div
					className={classNames(formLayoutClasses.body, formLayoutClasses.scrollCont, {
						blurred: locked && opened,
					})}
				>
					{isFieldVisible(FormFields.TITLE, { category, form }) && (
						<div className={formLayoutClasses.row}>
							<Field
								name="title"
								component={TextInput}
								placeholder={I18n.t(__T('js.task.enter_item_name'))}
								disabled={disabled}
								autoFocus
								maxLength={TITLE_MAX_LENGTH}
								className={classes.title}
								onClick={this.maybeOpenForm}
								onKeyDown={e => e.keyCode === KeyCodes.ENTER && this.onSubmit(e)}
								inputRef={this.refHandlers.titleInput}
								rightElement={
									<div
										className={classNames(classes.titleRightElement, {
											hidden: !opened,
										})}
									>
										{isFieldVisible(FormFields.COLOR, {
											category,
											form,
										}) && (
											<Field
												name="color"
												component={ColorPicker}
												popoverProps={{
													position: Position.BOTTOM_RIGHT,
												}}
											/>
										)}
										{isFieldVisible(FormFields.STAR, {
											category,
											form,
										}) && (
											<Field
												name="starred"
												component={StarCheckbox}
												className={classes.star}
											/>
										)}
									</div>
								}
							/>
							{!opened && (
								<Button
									text="Add"
									intent={Intent.PRIMARY}
									disabled={disabled}
									className={classes.titleBtn}
									onClick={this.maybeOpenForm}
								/>
							)}
						</div>
					)}

					<ItemFormBody
						form={form}
						hidden={!opened}
						category={category}
						isSubitem={isSubitem}
						selfPermissionLevel={selfPermissionLevel}
					/>
				</div>

				<div
					className={classNames(formLayoutClasses.actionsBar, {
						hidden: !opened,
						blurred: locked && opened,
					})}
				>
					<Button
						type="button"
						text={I18n.t(__T('js.task.cancel_button'))}
						className={classNames('pt-button', formLayoutClasses.actionBtn)}
						onClick={this.onCancel}
						disabled={locked}
					/>
					<Button
						type="button"
						onClick={this.onSubmit}
						text={submitBtnText}
						disabled={nothingChanged || locked}
						className={classNames(
							'pt-button',
							'pt-intent-primary',
							formLayoutClasses.actionBtn
						)}
					/>
				</div>

				{locked &&
					opened && (
						<div className={classes.loaderOverlay}>
							<Spinner />
						</div>
					)}
			</form>
		);
	}
}

ItemForm.propTypes = propTypes;
ItemForm.defaultProps = {
	openForm: null,
	className: '',
	opened: true,
	disabled: false,
	locked: false,
	nothingChanged: false,
	isSubitem: false,
	fixedHeight: false,
};

export default ItemForm;
