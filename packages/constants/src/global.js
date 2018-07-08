/**
 * @module constants/global
 */
import moment from 'moment-timezone';

/**
 * JS data types
 * @enum {String}
 */
export const Types = {
	STRING: 'STRING',
	OBJECT: 'OBJECT',
	ARRAY: 'ARRAY',
	DATE: 'DATE',
	MOMENT: 'MOMENT',
	NUMBER: 'NUMBER',
	BOOL: 'BOOL',
};

/**
 * Element types, used in react-dnd
 * @enum {String}
 */
export const DnDTypes = {
	LIST_ITEM: 'LIST_ITEM',
};

/**
 * Moment class constructor
 * @constant
 */
export const Moment = moment().constructor;

/**
 * Keys Codes, used for keyboard events
 * @enum {Number}
 */
export const KeyCodes = {
	ENTER: 13,
	COMMA: 188,
};
