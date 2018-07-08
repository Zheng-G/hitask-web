import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { getAvatarUrl } from '@hitask/utils/helpers';
import MultiSelect from '../FormControls/MultiSelect';
import { formatMultiSelectField, parseMultiSelectField } from '../FormControls/common';
import classes from './ItemParticipantsSelector.scss';

const getMyselfOption = selfProfile => ({
	id: selfProfile.id,
	label: I18n.t(__T('js.properties.assigned_myself')), // FIXME replace with user fullname
	avatarUrl: getAvatarUrl(selfProfile.pictureHash, 22),
});

const ItemParticipantsSelector = ({ selfProfile, teammates }) => (
	<Field
		name="participants"
		component={MultiSelect}
		items={[getMyselfOption(selfProfile)].concat(
			teammates.map(teammate => ({
				id: teammate.id,
				label: teammate.name,
				avatarUrl: getAvatarUrl(teammate.pictureHash, 22),
			}))
		)}
		parse={parseMultiSelectField}
		format={formatMultiSelectField}
		groupClassName={classes.selector}
		closeOnSelect
		tagInputProps={{
			placeholder: 'Add participants',
		}}
	/>
);

const { object, shape, arrayOf } = PropTypes;
ItemParticipantsSelector.propTypes = {
	selfProfile: shape({}).isRequired,
	teammates: arrayOf(object),
};

ItemParticipantsSelector.defaultProps = {
	teammates: [],
};

export default ItemParticipantsSelector;
