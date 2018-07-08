import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { logRender } from '@hitask/utils/debug';
import NewItemForm from '../../containers/NewItemFormContainer';
import ItemListTabsMini from '../../containers/ItemListTabsMiniContainer';
import ItemFormDialogs from '../ItemFormDialogs';
import classes from './ItemsPanelMini.scss';

class ItemsPanelMini extends Component {
	constructor(props) {
		super(props);
		this.openForm = this.openForm.bind(this);
		this.closeForm = this.closeForm.bind(this);
	}

	openForm() {
		this.props.toggleCreateForm({ isOpen: true });
		this.props.collapseAllItems({});
	}

	closeForm() {
		this.props.toggleCreateForm({ isOpen: false });
	}

	render() {
		const { itemsWereLoaded, createFormOpened, centralHeaderVisible } = this.props;
		logRender('render ItemsPanelMini');
		const showLoader = !itemsWereLoaded;
		return (
			<div
				className={classNames(classes.page, {
					[classes.collapsedHeader]: !centralHeaderVisible,
				})}
			>
				<NewItemForm
					opened={createFormOpened}
					openForm={this.openForm}
					closeForm={this.closeForm}
					className={classes.formContainer}
					disabled={showLoader}
				/>
				<div
					className={classNames(classes.pageBody, {
						hidden: createFormOpened,
					})}
				>
					<ItemListTabsMini loading={showLoader} />
				</div>
				<ItemFormDialogs />
			</div>
		);
	}
}

const { func, bool } = PropTypes;
ItemsPanelMini.propTypes = {
	toggleCreateForm: func.isRequired,
	collapseAllItems: func.isRequired,
	itemsWereLoaded: bool.isRequired,
	createFormOpened: bool.isRequired,
	centralHeaderVisible: bool.isRequired,
};

export default ItemsPanelMini;
