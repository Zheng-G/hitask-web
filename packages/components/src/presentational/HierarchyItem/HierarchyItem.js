import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqualWith from 'lodash/isEqualWith';
import { getItemHierarchyCollection } from '@hitask/modules/items';
import { logRender } from '@hitask/utils/debug';
import Item from '../../containers/ItemContainer';
import classes from './HierarchyItem.scss';

class HierarchyItem extends Component {
	shouldComponentUpdate(nextProps) {
		if (!nextProps.sortedHierarchy) return false;
		if (
			_isEqualWith(this.props, nextProps, (currProp, nextProp, propKey) => {
				if (propKey === 'sortedHierarchy') {
					// compare string-type collections instead of objects deepCompare
					return (
						getItemHierarchyCollection(currProp) ===
						getItemHierarchyCollection(nextProp)
					);
				}
				return undefined;
			})
		)
			return false;
		return true;
	}

	render() {
		const { id, sortedHierarchy, isTopLevel, ...otherProps } = this.props;
		if (!sortedHierarchy) return null;
		if (sortedHierarchy.id !== id) {
			return null; // Catch error, when sortedHierarchy was not calculated correctly
		}
		logRender(`render HierarchyItem ${id}`);
		return (
			<Item id={id} isTopLevel={isTopLevel} {...otherProps}>
				{sortedHierarchy.children.length ? (
					<div className={classes.childNode}>
						{sortedHierarchy.children.map((child, index) => (
							<HierarchyItem
								{...otherProps}
								id={child.id}
								key={child.id}
								index={index}
								sortedHierarchy={{
									id: child.id,
									children: child.children,
								}}
							/>
						))}
					</div>
				) : null}
			</Item>
		);
	}
}

const { number, shape, bool, arrayOf, object } = PropTypes;
HierarchyItem.propTypes = {
	id: number.isRequired,
	sortedHierarchy: shape({
		id: number,
		children: arrayOf(object),
	}).isRequired,
	isTopLevel: bool,
};

HierarchyItem.defaultProps = {
	isTopLevel: false,
};

export default HierarchyItem;
