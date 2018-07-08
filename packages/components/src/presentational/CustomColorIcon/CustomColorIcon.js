import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const { findDOMNode } = ReactDOM;

class CustomColorIcon extends Component {
	componentDidMount() {
		this.changePathStyle();
	}

	componentDidUpdate() {
		this.changePathStyle();
	}

	changePathStyle() {
		const icon = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
		const node = icon.querySelector(this.props.selector);
		if (node) {
			node.setAttribute('fill', this.props.color);
		}
	}

	render() {
		const { children, selector, color, ...other } = this.props;
		return React.cloneElement(children, other);
	}
}

const { string, any } = PropTypes;
CustomColorIcon.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	selector: string.isRequired,
	color: string.isRequired,
};

export default CustomColorIcon;
