import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import _isEqualWith from 'lodash/isEqualWith';
import classNames from 'classnames';
import { Collapse, Icon } from '@hitask/blueprint-core';
import { ItemGroups } from '@hitask/constants/layout';
import { SET_BADGE_COUNT } from '@hitask/constants/ipcEvents';
import { logRender } from '@hitask/utils/debug';
import ProjectGroupOpen from '@hitask/icons/ProjectGroupOpen.svg';
import ProjectGroupClosed from '@hitask/icons/ProjectGroupClosed.svg';
import ItemGroupBody from './ItemGroupBody';
import CustomColorIcon from '../CustomColorIcon';
import classes from './ItemGroup.scss';

const ipc = window.ipc;
class ItemGroup extends Component {
	constructor(props) {
		super(props);
		const { id, itemsKeys } = props;
		if (id === ItemGroups.TODAY_MAIN) {
			this.setBadgeCount(itemsKeys.length);
		}
	}

	shouldComponentUpdate(newProps) {
		if (
			_isEqualWith(
				this.props,
				newProps,
				(currProp, nextProp, propKey, currProps, nextProps) => {
					if (propKey === 'itemsKeys') {
						// Compare strings-type collections, not arrays (in performance reasons)
						return currProps.itemsKeys.join('') === nextProps.itemsKeys.join('');
					}
					return undefined;
				}
			)
		)
			return false;
		return true;
	}

	componentWillUpdate({ id, itemsKeys }) {
		if (id === ItemGroups.TODAY_MAIN) {
			this.setBadgeCount(itemsKeys.length);
		}
	}

	setBadgeCount = count => {
		if (!ipc) return;
		ipc.send(SET_BADGE_COUNT, count);
	};

	render() {
		const {
			id,
			itemsKeys,
			groupTitle,
			toggleCollapse,
			className,
			isOpen,
			containerId,
			getLastExpandedItemInfo,
			setLastExpandedItemInfo,
			transitionName,
			recurInstanceDate,
		} = this.props;
		const isProjectGroup = id.indexOf('PROJECT_') === 0;
		logRender(`render ItemGroup (${id})`);
		if (!itemsKeys.length && !isProjectGroup) return null;
		return (
			<div
				className={classNames(classes.group, className, {
					[classes.closed]: !isOpen,
					[classes.titledGroup]: groupTitle,
					[classes.overdueGroup]: id === ItemGroups.TODAY_OVERDUE,
					[classes.projectGroup]: isProjectGroup,
				})}
			>
				{groupTitle && (
					<div className={classes.head} onClick={toggleCollapse} role="presentation">
						{isProjectGroup ? (
							isOpen ? (
								<CustomColorIcon
									selector="path.icon-project-open--bottom"
									color="#ff0000"
								>
									<ProjectGroupOpen
										className={classes.customIcon}
										width={16}
										height={16}
									/>
								</CustomColorIcon>
							) : (
								<CustomColorIcon
									selector="path.icon-project-closed--bottom"
									color="#ff0000"
								>
									<ProjectGroupClosed
										className={classes.customIcon}
										width={16}
										height={16}
									/>
								</CustomColorIcon>
							)
						) : (
							<Icon
								iconName={isOpen ? 'caret-down' : 'caret-right'}
								className={classes.icon}
							/>
						)}
						<h3 className={classes.title}>{groupTitle}</h3>
						<span className={classes.counter}>
							{`${itemsKeys.length} ${I18n.t(
								itemsKeys.length === 1
									? __T('js.project.item')
									: __T('js.project.items')
							)}`}
						</span>
					</div>
				)}
				<Collapse isOpen={isOpen} transitionDuration={400} keepChildrenMounted>
					<div className={classes.listContainer}>
						{itemsKeys.length ? (
							<ItemGroupBody
								id={id}
								itemsKeys={itemsKeys}
								transitionName={transitionName}
								containerId={containerId}
								getLastExpandedItemInfo={getLastExpandedItemInfo}
								setLastExpandedItemInfo={setLastExpandedItemInfo}
								recurInstanceDate={recurInstanceDate}
							/>
						) : (
							<span>No items in project</span>
						)}
					</div>
				</Collapse>
			</div>
		);
	}
}

const { arrayOf, number, string, func, bool } = PropTypes;
ItemGroup.propTypes = {
	id: string,
	itemsKeys: arrayOf(number).isRequired,
	containerId: string,
	className: string,
	groupTitle: string,
	transitionName: string,
	isOpen: bool,
	getLastExpandedItemInfo: func.isRequired,
	setLastExpandedItemInfo: func.isRequired,
	toggleCollapse: func.isRequired,
	recurInstanceDate: string,
};

ItemGroup.defaultProps = {
	id: '',
	recurInstanceDate: null,
	isOpen: false,
	groupTitle: '',
	containerId: '',
	className: '',
	transitionName: '',
};

export default ItemGroup;
