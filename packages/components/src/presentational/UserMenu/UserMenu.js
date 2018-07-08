import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Popover, Menu, MenuItem, Classes as BpClasses, Position } from '@hitask/blueprint-core';

// TODO: localize
const UserMenu = ({ children, disabled, settingsClick, importClick, logoutClick }) => (
	<Popover
		popoverClassName={BpClasses.MINIMAL}
		position={Position.BOTTOM_RIGHT}
		isDisabled={disabled}
		rootElementTag="div"
	>
		{children}
		<Menu>
			{__ENABLE_SETTINGS__ ? (
				<MenuItem
					iconName="cog"
					text={I18n.t(__T('hi.header.settings'))}
					onClick={settingsClick}
				/>
			) : (
				<MenuItem
					iconName="cog"
					text={I18n.t(__T('hi.header.settings'))}
					href={`${__PLAY_APP_BASE_URL__}/settings`}
					target="_blank"
				/>
			)}
			{__ENABLE_IMPORT__ && (
				<MenuItem iconName="import" text="Import" onClick={importClick} />
			)}
			<MenuItem iconName="log-out" text="Logout" onClick={logoutClick} />
		</Menu>
	</Popover>
);

const { any, bool, func } = PropTypes;
UserMenu.propTypes = {
	disabled: bool,
	children: any.isRequired, // eslint-disable-line react/forbid-prop-types
	settingsClick: func.isRequired,
	importClick: func.isRequired,
	logoutClick: func.isRequired,
};

UserMenu.defaultProps = {
	disabled: false,
};

export default UserMenu;
