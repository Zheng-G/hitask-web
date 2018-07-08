/* eslint class-methods-use-this:0 react/no-unused-state:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { SelectOptionShape } from '../common';

class InputPopoverComponent extends React.PureComponent {
	constructor(props) {
		super(props);
		this.getAvailableItems = this.getAvailableItems.bind(this);
		this.openPopup = this.openPopup.bind(this);
		this.maybeOpenPopup = this.maybeOpenPopup.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.closePopupBlur = this.closePopupBlur.bind(this);
		this.handleButtonClick = this.handleButtonClick.bind(this);
		this.handleInputBlur = this.handleInputBlur.bind(this);
		this.maybeResetQuery = this.maybeResetQuery.bind(this);
	}

	getAvailableItems() {
		return this.props.items;
	}

	openPopup() {
		this.setState({
			isOpen: true,
		});
	}

	maybeOpenPopup() {
		if (this.getAvailableItems().length) {
			this.openPopup();
		}
	}

	togglePopupVisibility(filteredItems) {
		if (filteredItems.length && !this.state.isOpen) {
			this.openPopup();
		} else if (!filteredItems.length && this.state.isOpen) {
			this.setState({
				isOpen: false,
			});
		}
	}

	closePopup() {
		this.setState({
			isOpen: false,
		});
	}

	closePopupBlur() {
		this.closePopup();
		if (this.input != null) {
			this.input.blur();
		}
	}

	maybeResetQuery() {
		if (this.state && this.state.query) {
			this.setState({
				query: '',
			});
		}
	}

	handleButtonClick() {
		if (this.state.isOpen) {
			this.closePopup();
		} else {
			this.maybeOpenPopup();
		}
	}

	handleInputBlur = () =>
		requestAnimationFrame(() => {
			if (this.button && this.button === document.activeElement) return;
			if (this.state && this.state.isOpen) return; // If popup open, don't reset query. Do it in handlePopoverInteraction instead
			this.maybeResetQuery();
		});

	handlePopoverInteraction = () =>
		requestAnimationFrame(() => {
			if (this.input && this.input === document.activeElement) return;
			if (this.button && this.button === document.activeElement) return;
			if (!this.input) return;
			// the input is no longer focused so we can close the popover
			this.closePopup();
			this.maybeResetQuery();
		});

	refHandlers = {
		input: ref => {
			this.input = ref;
		},
		button: ref => {
			this.button = ref;
		},
		resetButton: ref => {
			this.resetButton = ref;
		},
	};
}

const { arrayOf } = PropTypes;
InputPopoverComponent.propTypes = {
	items: arrayOf(SelectOptionShape).isRequired,
};

InputPopoverComponent.defaultProps = {};

export default InputPopoverComponent;
