import moment from 'moment-timezone';
import { RecurTypes, ReminderTimeType, ItemCategories } from '@hitask/constants/item';
import { ValidationErrors } from '@hitask/constants/errors';
// import { logObject } from 'utils/debug';

let errors = {};

const processObject = (path, values) => {
	Object.keys(values).forEach(key => {
		if (Array.isArray(values[key])) {
			values[key].forEach((tempValues, index) => {
				if (!errors[key]) {
					errors[key] = [];
				}
				processObject([...path, key, index], tempValues);
			});
		} else {
			let newErrorLink = errors;
			path.forEach(pathKey => {
				if (Number.isInteger(pathKey)) {
					newErrorLink[pathKey] = {};
				}
				newErrorLink = newErrorLink[pathKey];
			});

			newErrorLink = newErrorLink || {};
		}
	});
};

// Since if value is not presented in 'values' during redux-form verification,
// we have to check required fields based on set list of required fields (set up during form creation).
const checkRequired = (path, values, requiredFields) => {
	Object.keys(requiredFields).forEach(key => {
		if (Array.isArray(requiredFields[key])) {
			values[key].forEach((tempValues, index) => {
				if (!errors[key]) {
					errors[key] = [];
				}
				if (requiredFields[key]) {
					checkRequired([...path, key, index], tempValues, requiredFields[key]);
				}
			});
		} else {
			let newErrorLink = errors;
			path.forEach(pathKey => {
				if (Number.isInteger(pathKey)) {
					newErrorLink[pathKey] = newErrorLink[pathKey] || {};
				}
				newErrorLink = newErrorLink[pathKey];
			});

			newErrorLink = newErrorLink || {};
			const keyToTest = requiredFields[key];
			if (keyToTest) {
				if (Object.keys(values).length) {
					// Do not invalidate empty objects
					newErrorLink[keyToTest] =
						newErrorLink[keyToTest] ||
						(!values[keyToTest] && ValidationErrors.REQUIRED);
				}
			}
		}
	});
};

const checkRecurItemsDuration = values => {
	const { recurType, startDate, endDate } = values;
	if (recurType !== RecurTypes.NONE && startDate && endDate) {
		let interval;
		switch (recurType) {
			case RecurTypes.DAILY:
				interval = 'days';
				break;
			case RecurTypes.WEEKLY:
				interval = 'weeks';
				break;
			case RecurTypes.MONTHLY:
				interval = 'months';
				break;
			case RecurTypes.YEARLY:
				interval = 'years';
				break;
			default:
				interval = 'days';
		}
		if (
			moment(startDate)
				.add(1, interval)
				.isSameOrBefore(moment(endDate), 'day')
		) {
			errors.endDate = ValidationErrors.LONG_RECUR_DURATION;
		}
	}
};

const checkItemAlerts = values => {
	const { alerts } = values;
	errors.alerts = false;
	alerts.forEach((alert, index) => {
		const restAlerts = alerts.filter((a, i) => i !== index);
		if (alert.timeType === ReminderTimeType.EXACT_TIME) {
			const duplicationAlert = restAlerts.find(a =>
				moment(a.timeSpecified).isSame(alert.timeSpecified)
			);
			if (duplicationAlert) {
				errors.alerts = ValidationErrors.DUPLICATION;
			}
		} else {
			const duplicationAlert = restAlerts.find(
				a => a.timeType === alert.timeType && a.time === alert.time
			);
			if (duplicationAlert) {
				errors.alerts = ValidationErrors.DUPLICATION;
			}
		}
	});
};

const checkItemPermissions = () => {
	errors.permissions = false;
};

const validate = function validate({ values, requiredFields = [] }) {
	// logObject(values, 'Values:');
	// logObject(props, 'Props:');
	errors = {};
	processObject([], values);
	checkRequired([], values, requiredFields);
	// logObject(errors, 'Errors:');
	return errors;
};

export const validateItemForm = function validateItemForm(values) {
	const requiredFields = ['title'].concat(
		values.category === ItemCategories.EVENT ? ['startDate'] : []
	);
	errors = validate({ values, requiredFields });
	checkRecurItemsDuration(values);
	checkItemPermissions(values);
	checkItemAlerts(values);
	return errors;
};

export default validate;
