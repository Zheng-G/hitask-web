import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { getAvatarUrl } from '@hitask/utils/helpers';
import SelectSuggest from '../FormControls/SelectSuggest';
import classes from './ItemAssignSelector.scss';

const getNullOption = () => ({
	// use function, not object, to recalculate I18n.t
	id: 0,
	label: I18n.t(__T('js.task.none')),
});

const getMyselfOption = selfProfile => ({
	id: selfProfile.id,
	label: I18n.t(__T('js.properties.assigned_myself')), // FIXME replace with user fullname
	avatarUrl: getAvatarUrl(selfProfile.pictureHash, 22),
});

const ItemAssigneeSelector = ({ selfProfile, teammates }) => (
	<Field
		name="assignee"
		component={SelectSuggest}
		items={[getNullOption(), getMyselfOption(selfProfile)].concat(
			teammates.map(teammate => ({
				id: teammate.id,
				label: teammate.name,
				avatarUrl: getAvatarUrl(teammate.pictureHash, 22),
			}))
		)}
		groupClassName={classes.selector}
		inputProps={{
			placeholder: 'Assign to...',
		}}
	/>
);

const { object, shape, arrayOf } = PropTypes;
ItemAssigneeSelector.propTypes = {
	selfProfile: shape({}).isRequired,
	teammates: arrayOf(object),
};

ItemAssigneeSelector.defaultProps = {
	teammates: [],
};

export default ItemAssigneeSelector;
