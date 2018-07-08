import React from 'react';
import PropTypes from 'prop-types';
import ICONS from './icons';
import IconRow from './IconRow';

const IconsTable = ({ group, title }) => (
	<span>
		<h2>{title}</h2>
		<div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
			{ICONS[group].map(({ name, icon }, id) => (
				<IconRow key={name} id={id + 1} name={name} icon={icon} />
			))}
		</div>
	</span>
);

const { string } = PropTypes;
IconsTable.propTypes = {
	group: string.isRequired,
	title: string.isRequired,
};
export default IconsTable;
