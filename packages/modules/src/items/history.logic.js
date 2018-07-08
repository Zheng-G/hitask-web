/**
 * @module modules/items
 */
import { renameObjectKeys, invertKeysWithProps, getAvatarUrl } from '@hitask/utils/helpers';
import { ItemHistoryUnitTypes, ItemHistoryUnitLabels } from '@hitask/constants/item';
import { getItemBaseProps } from './items.logic';

// ------------------------------------
// Constants
// ------------------------------------
const HISTORY_PROPS_RENAME_MAP = {
	userId: 'user_id',
	userName: 'user_name',
	propType: 'property_type',
	propName: 'property_name',
	// id, value, time,
};

// ------------------------------------
// Helpers
// ------------------------------------
const getItemHistoryUnitLabel = (value, propName, isComment) => {
	if (isComment) return value;
	return ItemHistoryUnitLabels[propName] || propName;
};

const findTeammateProfile = (userId, teammatesProfiles) => {
	const targetUser = teammatesProfiles.find(user => user.id === userId);
	return targetUser || {};
};

// ------------------------------------
// Logic
// ------------------------------------
/**
 * Add metadata to history unit
 * @function
 * @param {Number} itemId item id that unit is related to
 * @param {Object} selfProfile current user profile
 * @param {Array} teammatesProfiles profiles of teammates
 * @return {Function} extender function
 */
const historyUnitExtenderFactory = (itemId, selfProfile, teammatesProfiles) => ({
	id,
	value,
	time,
	userId,
	userName,
	propName,
}) => {
	const isOwnUnit = userId === selfProfile.id;
	const userProfile = isOwnUnit ? selfProfile : findTeammateProfile(userId, teammatesProfiles);
	const isComment = propName === ItemHistoryUnitTypes.COMMENT_ADDED;
	return {
		// API props:
		id,
		value: getItemHistoryUnitLabel(value, propName, isComment),
		time,
		userId,
		userName: userName || userProfile.name,
		// Custom props:
		itemId,
		isOwnUnit,
		isComment,
		avatarUrl: getAvatarUrl(userProfile.pictureHash, 32),
	};
};

/**
 * Merge history units under same timestamp into one unit
 * @function
 * @param {Array} units original history units
 * @return {Array} formatted history units
 */
export const reduceUnitsUnderSameTime = units => {
	if (units.length === 0) return units;
	let reducedUnits = [];
	let prevUnit = units[0];
	units.map(unit => {
		if (unit.id === prevUnit.id) return null;
		if (unit.userName === prevUnit.userName && unit.time === prevUnit.time) {
			prevUnit.value = `${prevUnit.value}\n${unit.value}`;
		} else {
			reducedUnits = [...reducedUnits, prevUnit];
			prevUnit = unit;
		}
		return unit;
	});
	reducedUnits = [...reducedUnits, prevUnit];
	return reducedUnits;
};

/**
 * Format history item from API server before saving in store
 * @function
 * @param {Object} item origin history item
 * @return {Object} formatted item
 */
export const formatFetchedHistoryUnit = item => {
	const revertedPropsRenameMap = invertKeysWithProps(HISTORY_PROPS_RENAME_MAP);
	const formattedUnit = renameObjectKeys(item, revertedPropsRenameMap);
	return formattedUnit;
};

/**
 * Get available history units for target item
 * @function
 * @param {Object} itemsHash hash of items
 * @param {Object} historyHash hash of history units for items
 * @param {Number} itemId target item id
 * @param {Object} selfProfile current user profile
 * @param {Array} teammatesProfiles profiles of teammates
 * @return {Array} available history units for target item
 */
export const getItemHistory = (itemsHash, historyHash, itemId, selfProfile, teammatesProfiles) => {
	const itemHistory = historyHash[itemId];
	if (itemHistory) {
		const extendedItemHistory = itemHistory.map(
			historyUnitExtenderFactory(itemId, selfProfile, teammatesProfiles)
		);
		return reduceUnitsUnderSameTime(extendedItemHistory);
	}
	const item = getItemBaseProps(itemsHash, itemId, [
		// API props:
		'lastComment',
		'lastCommentId',
		'lastCommentCreateDate',
		'lastCommentUserId',
		// Custom props:
	]);
	if (!item.lastCommentId) return [];
	const extendedItemHistory = [
		{
			id: item.lastCommentId,
			value: item.lastComment,
			time: item.lastCommentCreateDate,
			userId: item.lastCommentUserId,
			propName: ItemHistoryUnitTypes.COMMENT_ADDED,
		},
	].map(historyUnitExtenderFactory(itemId, selfProfile, teammatesProfiles));
	return reduceUnitsUnderSameTime(extendedItemHistory);
};

/**
 * Remove history unit from history log of particular item
 * @function
 * @param {Array|undefined} itemHistoryUnits current history units of particular item
 * @param {Number} unitId target history unit id
 * @return {Array} modified history units for item
 */
export const removeHistoryUnit = (itemHistoryUnits, unitId) => {
	if (!itemHistoryUnits) return [];
	return itemHistoryUnits.filter(unit => unit.id !== unitId);
};

/**
 * Add history unit to history log of particular item
 * @function
 * @param {Array|undefined} itemHistoryUnits current history units of particular item
 * @param {Object} targetUnit history unit data
 * @return {Array} modified history units for item
 */
export const saveHistoryUnit = (itemHistoryUnits, targetUnit) => {
	if (!itemHistoryUnits) return [targetUnit];
	return removeHistoryUnit(itemHistoryUnits, targetUnit.id).concat([targetUnit]);
};

/**
 * Get last comment from item history
 * @function
 * @param {Array|undefined} itemHistoryUnits current history units of particular item
 * @return {Object|null} last comment
 */
export const getLastComment = itemHistoryUnits => {
	if (!itemHistoryUnits) return null;
	const comments = itemHistoryUnits.filter(
		unit => unit.propName === ItemHistoryUnitTypes.COMMENT_ADDED
	);
	if (!comments.length) return null;
	return comments[comments.length - 1];
};
