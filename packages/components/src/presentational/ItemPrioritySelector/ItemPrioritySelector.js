import React from 'react';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { Priorities } from '@hitask/constants/item';
import RadioGroup from '../FormControls/RadioGroup';

const ItemPrioritySelector = () => (
	<Field
		name="priority"
		component={RadioGroup}
		items={{
			low: {
				value: Priorities.LOW.id,
				label: I18n.t(Priorities.LOW.label),
				inline: true,
			},
			normal: {
				value: Priorities.NORMAL.id,
				label: I18n.t(Priorities.NORMAL.label),
				inline: true,
			},
			high: {
				value: Priorities.HIGH.id,
				label: I18n.t(Priorities.HIGH.label),
				inline: true,
			},
		}}
	/>
);

export default ItemPrioritySelector;
