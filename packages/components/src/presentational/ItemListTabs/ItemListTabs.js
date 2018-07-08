import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import { Tabs2, Tab2 } from '@hitask/blueprint-core';
import { Tabs } from '@hitask/constants/tabs';
import { ItemTabs } from '@hitask/modules/tabs';
import { logRender } from '@hitask/utils/debug';
import BigCalendar from '../../containers/BigCalendarContainer';
import ItemListToolbarMini from '../../containers/ItemListToolbarMiniContainer';
import TodayList from '../../containers/ItemList/TodayListContainer';
import AllItemsList from '../../containers/ItemList/AllItemsListContainer';
import ProjectsList from '../../containers/ItemList/ProjectsListContainer';
import Spinner from '../Spinner';
import classes from './ItemListTabs.scss';

class ItemListTabs extends React.PureComponent {
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
		const withToolbar = selectedTabId !== Tabs.CALENDAR;

		logRender('render ItemListTabs');
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
							case Tabs.CALENDAR:
								panel = (
									<div className={classes.panelContainer}>
										<BigCalendar />
									</div>
								);
								break;
							case Tabs.PROJECT:
								panel = (
									<div className={classes.panelContainer}>
										<ProjectsList />
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
ItemListTabs.propTypes = {
	selectedTabId: string.isRequired,
	changeActiveTab: func.isRequired,
	createFormOpened: bool,
	loading: bool,
	centralHeaderVisible: bool,
};

ItemListTabs.defaultProps = {
	loading: false,
	createFormOpened: false,
	centralHeaderVisible: true,
};

export default ItemListTabs;
