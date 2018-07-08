import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { Tabs2, Tab2 } from '@hitask/blueprint-core';
import { Tabs } from '@hitask/constants/tabs';
import { ItemTabs } from '@hitask/modules/tabs';
import { logRender } from '@hitask/utils/debug';
import ItemListToolbarMini from '../../containers/ItemListToolbarMiniContainer';
import TodayList from '../../containers/ItemList/TodayListContainer';
import AllItemsList from '../../containers/ItemList/AllItemsListContainer';
import Spinner from '../Spinner';
import classes from './ItemListTabsMini.scss';

class ItemListTabsMini extends React.PureComponent {
	constructor(props) {
		super(props);
		this.animate = false;
		this.createFormOpened = false;
		this.visitedTabs = new Set();
	}

	componentDidMount() {
		this.animate = true;
	}

	componentWillReceiveProps({ selectedTabId }) {
		this.visitedTabs.add(selectedTabId);
	}

	render() {
		const {
			selectedTabId,
			changeActiveTab,
			loading,
			centralHeaderVisible,
			createFormOpened,
		} = this.props;

		const animate = !this.createFormOpened && createFormOpened ? false : this.animate; // Don't animate after createForm was opened
		this.createFormOpened = createFormOpened;
		const withToolbar = true;

		logRender('render ItemListTabsMini');
		return (
			<div className={classes.container}>
				<div className={classes.toolbarContainer}>
					<ItemListToolbarMini hidden={!withToolbar} />
				</div>
				<Tabs2
					id={ItemTabs.id}
					selectedTabId={selectedTabId}
					className={classNames(classes.tabs, {
						[classes.withToolbar]: withToolbar,
						[classes.collapsedHeader]: !centralHeaderVisible,
					})}
					onChange={changeActiveTab}
					animate={animate}
					renderActiveTabPanelOnly={this.visitedTabs.size <= 1}
				>
					{ItemTabs.tabs.map(tab => {
						let panel = <div />;
						switch (tab.id) {
							case Tabs.TODAY:
								panel = (
									<div className={classes.panelContainer}>
										<TodayList />
									</div>
								);
								break;
							case Tabs.ALL_ITEMS:
								panel = (
									<div className={classes.panelContainer}>
										<AllItemsList />
									</div>
								);
								break;
							default:
						}
						if (loading) {
							panel = <Spinner wrapped />;
						}
						return (
							<Tab2
								id={tab.id}
								key={tab.id}
								title={I18n.t(tab.title)}
								panel={panel}
							/>
						);
					})}
				</Tabs2>
			</div>
		);
	}
}

const { string, func, bool } = PropTypes;
ItemListTabsMini.propTypes = {
	selectedTabId: string.isRequired,
	changeActiveTab: func.isRequired,
	createFormOpened: bool,
	loading: bool,
	centralHeaderVisible: bool,
};

ItemListTabsMini.defaultProps = {
	loading: false,
	createFormOpened: false,
	centralHeaderVisible: true,
};

export default ItemListTabsMini;
