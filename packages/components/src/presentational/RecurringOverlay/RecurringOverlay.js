import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Overlay, Classes as BpClasses } from '@hitask/blueprint-core';
import RecurringForm from '../../containers/RecurringFormContainer';
import cardClasses from '../Card';
import classes from './RecurringOverlay.scss';

const RecurringOverlay = ({ isOpen, closeOverlay, form }) => (
	<Overlay title="Recurring settings" isOpen={isOpen} onClose={closeOverlay}>
		<RecurringForm
			parentForm={form}
			className={classNames(
				BpClasses.CARD,
				cardClasses.card,
				classes.card,
				'fade-overlay-transition'
			)}
			cancelCallback={closeOverlay}
			submitCallback={closeOverlay}
		/>
	</Overlay>
);

const { bool, func, string } = PropTypes;
RecurringOverlay.propTypes = {
	isOpen: bool.isRequired,
	closeOverlay: func.isRequired,
	form: string,
};

RecurringOverlay.defaultProps = {
	form: '', // Prop is passed when overlay opened
};

export default RecurringOverlay;
