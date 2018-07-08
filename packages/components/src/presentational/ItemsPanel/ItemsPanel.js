import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { logRender } from '@hitask/utils/debug';
import NewItemForm from '../../containers/NewItemFormContainer';
import ItemListTabs from '../../containers/ItemListTabsContainer';
import ItemFormDialogs from '../ItemFormDialogs';
import ItemViewDialog from '../../containers/Dialogs/ItemViewDialogContainer';
import classes from './ItemsPanel.scss';

class ItemsPanel extends Component {
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
		logRender('render ItemsPanel');
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
					<ItemListTabs loading={showLoader} />
				</div>
				<ItemFormDialogs />
				<ItemViewDialog />
			</div>
		);
	}
}

const { func, bool } = PropTypes;
ItemsPanel.propTypes = {
	toggleCreateForm: func.isRequired,
	collapseAllItems: func.isRequired,
	itemsWereLoaded: bool.isRequired,
	createFormOpened: bool.isRequired,
	centralHeaderVisible: bool.isRequired,
};

export default ItemsPanel;
