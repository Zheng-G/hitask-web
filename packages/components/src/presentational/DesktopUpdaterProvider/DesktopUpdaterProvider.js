import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logRender } from '@hitask/utils/debug';
import { APP_UPDATER_READY, APP_UPDATE_READY } from '@hitask/constants/ipcEvents';
import DesktopUpdateDialog from '../../containers/Dialogs/DesktopUpdateDialogContainer';

const ipc = window.ipc;
class DesktopUpdaterProvider extends Component {
	componentWillMount() {
		if (ipc) {
			ipc.send(APP_UPDATER_READY);
			ipc.on(APP_UPDATE_READY, () => {
				this.props.onUpdateReady();
			});
		}
	}

	render() {
		const { children } = this.props;
		logRender('render DesktopUpdaterProvider');
		return (
			<div className="full-height">
				{children}
				<DesktopUpdateDialog />
			</div>
		);
	}
}

const { any, func } = PropTypes;
DesktopUpdaterProvider.propTypes = {
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	onUpdateReady: func.isRequired,
};

export default DesktopUpdaterProvider;
