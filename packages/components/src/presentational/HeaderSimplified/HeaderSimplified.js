import React from 'react';
import HitaskLogo from '@hitask/icons/HitaskLogo.svg';
import Link from '../LinkAdaptive';
import classes from './HeaderSimplified.scss';

const HeaderSimplified = () => (
	<header className={classes.header}>
		<Link
			className={classes.logo}
			href={`${__PLAY_APP_BASE_URL__}/app`}
			title={`Hitask ${__APP_VERSION__} (${__BUILD_ID__})`}
		>
			<HitaskLogo width={109} height={20} className={classes.icon} />
		</Link>
	</header>
);

export default HeaderSimplified;
