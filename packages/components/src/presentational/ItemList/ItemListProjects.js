import React from 'react';
import PropTypes from 'prop-types';
import _isEqualWith from 'lodash/isEqualWith';
import { logRender } from '@hitask/utils/debug';
import ProjectGroup from '../../containers/ItemGroups/ProjectGroupContainer';
import NoItems from '../../presentational/NoItems';
import ItemListBase from './ItemListBase';
import classes from './ItemList.scss';

class ItemListProjects extends ItemListBase {
	shouldComponentUpdate(nextProps) {
		if (
			_isEqualWith(this.props, nextProps, (currProp, nextProp, propKey) => {
				if (propKey === 'projects') return currProp.join() === nextProp.join(); // Compare concatted arrays instead of deep compare
				return undefined;
			})
		)
			return false;
		return true;
	}

	componentDidMount() {
		this.props.syncProjectGroups({ projects: this.props.projects });
	}

	componentWillReceiveProps({ projects }) {
		if (this.props.projects.join() !== projects.join()) {
			this.props.syncProjectGroups({ projects });
		}
	}

	render() {
		const { containerId, projects } = this.props;
		logRender(`render ItemListProjects (${containerId})`);
		const noProjects = !projects.length;
		return noProjects ? (
			<NoItems />
		) : (
			<div
				className={classes.outterContainer}
				id={containerId}
				onWheel={e => this.handleWheelDebounced(e.deltaY)}
				ref={this.refHandlers.outterWrapNode}
			>
				<div className={classes.innerContainer} ref={this.refHandlers.innerWrapNode}>
					{projects.map(projectId => (
						<ProjectGroup
							key={projectId}
							id={projectId}
							containerId={containerId}
							getLastExpandedItemInfo={this.getLastExpandedItemInfo}
							setLastExpandedItemInfo={this.setLastExpandedItemInfo}
						/>
					))}
				</div>
			</div>
		);
	}
}

const { arrayOf, number, string, func } = PropTypes;
ItemListProjects.propTypes = {
	projects: arrayOf(number).isRequired,
	containerId: string,
	syncProjectGroups: func.isRequired,
};

ItemListProjects.defaultProps = {
	containerId: '',
};

export default ItemListProjects;
