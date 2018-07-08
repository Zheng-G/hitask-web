import React from 'react';
import PropTypes from 'prop-types';
import GoogleIcon from '@hitask/icons/Google.svg';
import Link from '../LinkAdaptive';
import classes from './GoogleLink.scss';

const GoogleLink = ({ href, text, ...rest }) => (
	<Link className={classes.googleBtn} href={href} {...rest}>
		<div className={classes.btnIcon}>
			<GoogleIcon width={19} height={19} />
		</div>
		<span className={classes.btnContents}>{text}</span>
	</Link>
);

const { string } = PropTypes;
GoogleLink.propTypes = {
	text: string.isRequired,
	href: string,
};

GoogleLink.defaultProps = {
	href: null,
};

export default GoogleLink;
