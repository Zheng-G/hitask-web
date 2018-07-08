import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ItemFormStar from '@hitask/icons/ItemFormStar.svg';
import ItemFormStarOff from '@hitask/icons/ItemFormStarOff.svg';
import { FieldInputShape, FieldMetaShape } from '../common';
import classes from './StarCheckbox.scss';

class StarCheckbox extends React.PureComponent {
	render() {
		const { input, meta, className } = this.props;
		return (
			<div className={classNames(classes.container, className)}>
				<label className={classes.label} htmlFor={`${meta.form}-${input.name}-starCheck`}>
					<input
						{...input}
						onChange={e => input.onChange(e.target.checked)}
						id={`${meta.form}-${input.name}-starCheck`}
						type="checkbox"
						className={classes.input}
					/>
					{input.value ? (
						<ItemFormStar width={24} height={23} />
					) : (
						<ItemFormStarOff width={24} height={23} />
					)}
				</label>
			</div>
		);
	}
}

const { string } = PropTypes;
StarCheckbox.propTypes = {
	input: FieldInputShape.isRequired,
	meta: FieldMetaShape.isRequired,
	className: string,
};

StarCheckbox.defaultProps = {
	className: '',
};

export default StarCheckbox;
