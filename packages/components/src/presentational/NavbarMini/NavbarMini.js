import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Classes as BpClasses } from '@hitask/blueprint-core';
import { getAvatarUrl, isExtension } from '@hitask/utils/helpers';
import { logRender } from '@hitask/utils/debug';
import HitaskLogo from '@hitask/icons/HitaskLogo.svg';
import UserMenu from '../../containers/UserMenuContainer';
import classes from './NavbarMini.scss';

const NavbarMini = ({ title, pictureHash, children }) => {
	logRender('render NavbarMini');
	return (
		<header className={classes.navbar}>
			<h1 className={classes.title}>{title}</h1>
			<div className={classes.controls}>
				<div
					style={{ height: '18px', lineHeight: '26px' }}
					title={`Hitask ${__APP_VERSION__} (${__BUILD_ID__})`}
				>
					<HitaskLogo width={92} height={17} />
					{!isExtension && <span className={classes.logoLabel}>βetα</span>}
				</div>
				<div className={classes.centerContainer}>{children}</div>
				<div
					className={classNames(classes.avatarCont, {
						[classes.clickable]: !isExtension,
					})}
				>
					<UserMenu disabled={isExtension}>
						<img
							src={getAvatarUrl(pictureHash, 22)}
							alt="  "
							className={classNames(classes.avatar, BpClasses.SKELETON)}
						/>
					</UserMenu>
				</div>
			</div>
		</header>
	);
};

const { string, any } = PropTypes;
NavbarMini.propTypes = {
	children: any, // eslint-disable-line react/forbid-prop-types
	title: string,
	pictureHash: string.isRequired,
};

NavbarMini.defaultProps = {
	title: '',
	children: null,
};

export default NavbarMini;
