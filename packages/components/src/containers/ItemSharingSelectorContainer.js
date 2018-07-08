import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form';
import { selfIdSelector } from '@hitask/modules/auth';
import {
	defaultSharingLevelSelector,
	everyoneIdSelector,
	teammatesProfilesSelector,
} from '@hitask/modules/user';
import { getAvatarUrl } from '@hitask/utils/helpers';
import { PermissionLevels } from '@hitask/constants/item';
import { DefaultPrefs } from '@hitask/constants/preferences';
import ItemSharingSelector from '../presentational/ItemSharingSelector';

const mapActionCreators = {};

const ENABLED_LEVELS = [
	PermissionLevels.VIEW_COMMENT.id,
	PermissionLevels.COMPLETE_ASSIGN.id,
	PermissionLevels.MODIFY.id,
	PermissionLevels.EVERYTHING.id,
];

const levels = Object.keys(PermissionLevels)
	.reduce((acc, key) => {
		acc.push(PermissionLevels[key]);
		return acc;
	}, [])
	.filter(perm => ENABLED_LEVELS.includes(perm.id));

const everyoneArraySelector = createSelector(everyoneIdSelector, everyoneId => {
	if (!everyoneId) return [];
	return [
		{
			id: everyoneId,
			label: 'Everyone',
			iconName: 'people',
		},
	];
});

const teammatesSelector = createSelector(teammatesProfilesSelector, teammates => {
	return teammates.map(member => ({
		id: member.id.toString(), // Pass id in string type for easy comparison
		label: member.name,
		avatarUrl: getAvatarUrl(member.pictureHash, 22),
	}));
});

const principalsSelectorFactory = form => {
	return createSelector(
		[
			everyoneArraySelector,
			state => formValueSelector(form)(state, 'userId'),
			teammatesSelector,
		],
		(everyoneArray, itemOwnerId, teammates) => {
			const principals = everyoneArray.concat(teammates).map(principal => {
				if (!itemOwnerId) return principal;
				if (itemOwnerId.toString() === principal.id.toString()) {
					principal.disabled = true; // Can't modify item owner permission
				}
				return principal;
			});
			return principals;
		}
	);
};

const mapStateToProps = (initState, { form }) => {
	const selfId = selfIdSelector(initState);
	const selfIdStr = selfId.toString();
	const principalsSelector = principalsSelectorFactory(form);
	return state => {
		return {
			principals: principalsSelector(state),
			levels,
			defaultLevel:
				defaultSharingLevelSelector(state) || DefaultPrefs.defaultSharingPermission,
			selfId: selfIdStr,
			everyoneId: everyoneIdSelector(state),
		};
	};
};

export default connect(mapStateToProps, mapActionCreators)(ItemSharingSelector);
