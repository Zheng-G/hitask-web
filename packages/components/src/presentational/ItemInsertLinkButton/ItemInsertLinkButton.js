import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-redux-i18n';
import { isExtension } from '@hitask/utils/helpers';
import IconLink from '@hitask/icons/IconLink.svg';
import classes from './ItemInsertLinkButton.scss';

class ItemInsertLinkButton extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.onClickHandler = this.onClickHandler.bind(this);
	}

	componentWillMount() {
		if (!isExtension) return;
		chrome.tabs.query({ active: true }, tabsArray => {
			const currentTab = tabsArray[0];
			if (!currentTab) return;
			this.setState({
				pageTitle: currentTab.title,
				pageURL: currentTab.url,
			});
		});
	}

	onClickHandler() {
		const { pageTitle, pageURL } = this.state;
		const { insertLink } = this.props;
		insertLink(pageTitle, pageURL);
		this.button.blur();
	}

	refHandlers = {
		button: ref => {
			this.button = ref;
		},
	};

	render() {
		const { pageTitle, pageURL } = this.state;
		if (!pageTitle || !pageURL) return null;
		return (
			<button
				onClick={this.onClickHandler}
				className={classes.button}
				ref={this.refHandlers.button}
			>
				<IconLink width={17} height={16} className={classes.icon} />
				<span className={classes.textWrapper}>
					<Translate value={__T('js.task.insert_link_to')} className={classes.prefix} />
					<span className={classes.pageTitle}>{pageTitle}</span>
				</span>
			</button>
		);
	}
}

const { func } = PropTypes;
ItemInsertLinkButton.propTypes = {
	insertLink: func.isRequired,
};

export default ItemInsertLinkButton;
