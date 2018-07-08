import { Component } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';

class ItemList extends Component {
	constructor(props) {
		super(props);
		this.lastExpandedItemInfo = null;
		this.scrollThreshold = 10;
		this.scrollHandleDelay = 200;
		this.getLastExpandedItemInfo = this.getLastExpandedItemInfo.bind(this);
		this.setLastExpandedItemInfo = this.setLastExpandedItemInfo.bind(this);
		this.handleWheelDebounced = this.handleWheelDebounced.bind(this);
	}

	getLastExpandedItemInfo() {
		return this.lastExpandedItemInfo;
	}

	setLastExpandedItemInfo(itemInfo) {
		if (!this.outterWrapNode || !this.innerWrapNode) return;
		const outterWrapHeight = this.outterWrapNode.getBoundingClientRect().height;
		const innerWrapHeight = this.innerWrapNode.getBoundingClientRect().height;
		if (itemInfo) {
			if (itemInfo.height > outterWrapHeight) {
				this.props.toggleCentralHeader({ isOpen: false });
			}
		} else if (this.lastExpandedItemInfo && !itemInfo) {
			// Run once on change only
			if (outterWrapHeight > innerWrapHeight) {
				this.props.toggleCentralHeader({ isOpen: true });
			}
		}
		this.lastExpandedItemInfo = itemInfo;
	}

	handleWheel(deltaY) {
		if (this.props.someItemIsExpanded) return; // Don't handle when item is expanded
		if (!this.outterWrapNode || !this.innerWrapNode) return;
		if (Math.abs(deltaY) < this.scrollThreshold) return; // Skip small moves

		const outterWrapHeight = this.outterWrapNode.getBoundingClientRect().height;
		const innerWrapHeight = this.innerWrapNode.getBoundingClientRect().height;
		if (deltaY > 0 && outterWrapHeight > innerWrapHeight) return; // Don't hide. There is enough free space

		const { centralHeaderVisible, toggleCentralHeader } = this.props;
		if (deltaY < 0 && !centralHeaderVisible) {
			toggleCentralHeader({ isOpen: true });
		} else if (deltaY > 0 && centralHeaderVisible) {
			toggleCentralHeader({ isOpen: false });
		}
	}

	handleWheelDebounced = _debounce(this.handleWheel, this.scrollHandleDelay, {
		maxWait: this.scrollHandleDelay,
	});

	refHandlers = {
		outterWrapNode: ref => {
			this.outterWrapNode = ref;
		},
		innerWrapNode: ref => {
			this.innerWrapNode = ref;
		},
	};
}

const { bool, func } = PropTypes;
ItemList.propTypes = {
	centralHeaderVisible: bool,
	someItemIsExpanded: bool,
	toggleCentralHeader: func.isRequired,
};

ItemList.defaultProps = {
	someItemIsExpanded: false,
	centralHeaderVisible: true,
};

export default ItemList;
