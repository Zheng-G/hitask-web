import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { Intent, Checkbox } from '@hitask/blueprint-core';
import { logRender } from '@hitask/utils/debug';
import Alert from '../Alert';

class ConfirmItemCompleteAlert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			disableNextTime: false,
		};
		this.handleChekboxClick = this.handleChekboxClick.bind(this);
	}

	handleChekboxClick(event) {
		const disableNextTime = event.target.checked;
		this.setState({
			disableNextTime,
		});
	}

	render() {
		const { isOpen, itemId, completeItem, closeAlert, recurInstanceDate } = this.props;
		logRender('render ConfirmItemCompleteAlert');
		return (
			<Alert
				isOpen={isOpen}
				onConfirm={() => {
					completeItem(itemId, this.state.disableNextTime, recurInstanceDate);
					closeAlert();
				}}
				onCancel={closeAlert}
				confirmButtonText={I18n.t(__T('js.task.complete'))}
				cancelButtonText={I18n.t(__T('js.task.cancel_button'))}
				intent={Intent.PRIMARY}
			>
				<div>
					<h5>
						<Translate value={__T('js.task.complete_item_alert')} />
					</h5>
					<Checkbox
						checked={this.state.disableNextTime}
						label={I18n.t(__T('js.task.dont_ask_again'))}
						onChange={this.handleChekboxClick}
					/>
				</div>
			</Alert>
		);
	}
}

const { bool, func, number, string } = PropTypes;
ConfirmItemCompleteAlert.propTypes = {
	isOpen: bool.isRequired,
	itemId: number,
	completeItem: func.isRequired,
	closeAlert: func.isRequired,
	recurInstanceDate: string,
};

ConfirmItemCompleteAlert.defaultProps = {
	itemId: null,
	recurInstanceDate: null,
};

export default ConfirmItemCompleteAlert;
