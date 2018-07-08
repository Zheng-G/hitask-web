import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { animateScroll } from 'react-scroll';
import _isEqualWith from 'lodash/isEqualWith';
import { Translate } from 'react-redux-i18n';
import { Icon } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import ItemHistoryUnit from '..//ItemHistoryUnit';
import Spinner from '../Spinner';
import classes from './ItemHistory.scss';

const unit2string = unit => [unit.id, unit.value].join();
const getUnitsCollection = units => units.map(unit2string).join();

class ItemHistory extends Component {
	constructor(props) {
		super(props);
		this.containerId = `history-log-${props.itemId}`;
		this.onActionButtonClick = this.onActionButtonClick.bind(this);
	}

	shouldComponentUpdate(nextProps) {
		if (
			_isEqualWith(this.props, nextProps, (currProp, nextProp, propKey) => {
				if (propKey === 'units') {
					return getUnitsCollection(currProp) === getUnitsCollection(nextProp);
				}
				return undefined;
			})
		) {
			return false;
		}
		return true;
	}

	componentDidUpdate() {
		this.scrollToHistoryBottom();
	}

	onActionButtonClick() {
		const { isOpen, toggleCollapse } = this.props;
		toggleCollapse(!isOpen);
	}

	// createDeleteCommentHandler(commentId) {
	// 	return () => this.props.deleteComment(commentId);
	// }

	scrollToHistoryBottom() {
		animateScroll.scrollToBottom({
			smooth: true,
			duration: 200,
			delay: 50,
			isDynamic: true,
			containerId: this.containerId,
		});
	}

	render() {
		const { units, itemId, isOpen } = this.props;
		const showLoader = !units.length;
		logRender(`render ItemHistory #${itemId}`);
		return (
			<div
				className={classNames(classes.container, {
					[classes.expanded]: isOpen,
				})}
			>
				<div className={classes.toolbar}>
					<button
						onClick={this.onActionButtonClick}
						className={classes.toggleButton}
						type="button"
					>
						<Icon iconName={isOpen ? 'caret-down' : 'caret-right'} />
						<Translate value={__T('js.task.comments_and_history')} />
					</button>
				</div>
				<div
					className={classNames(classes.unitsContainer, {
						[classes.showSpinner]: showLoader,
					})}
					id={this.containerId}
				>
					{showLoader ? (
						<Spinner wrapped />
					) : (
						units.map(unit => (
							<ItemHistoryUnit
								key={unit.id}
								{...unit}
								canDelete={unit.isOwnUnit && unit.isComment}
								// onDeleteClick={this.createDeleteCommentHandler(unit.id)}
							/>
						))
					)}
				</div>
			</div>
		);
	}
}

const { arrayOf, func, number, object, bool } = PropTypes;
ItemHistory.propTypes = {
	units: arrayOf(object).isRequired,
	itemId: number.isRequired,
	isOpen: bool.isRequired,
	toggleCollapse: func.isRequired,
	deleteComment: func.isRequired,
};

export default ItemHistory;
