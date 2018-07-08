import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@hitask/blueprint-core';
import ReduxFormInput from '../Catalog/ReduxFormInput';
import TextInput from '../FormControls/TextInput';
import Checkbox from '../FormControls/Checkbox';
import RadioGroup from '../FormControls/RadioGroup';
import Select from '../FormControls/Select';
import classes from './FormLayout.scss';

storiesOf('Item Form/FormLayout', module).add('default', () => (
	<form autoComplete="off" className={classes.form} onSubmit={event => event.preventDefault()}>
		<div className={classes.row}>
			<ReduxFormInput defaultValue="">
				<TextInput placeholder="TextInput" />
			</ReduxFormInput>
		</div>

		<div className={classes.row}>
			<div className={classes.rowLabel}>Row Input</div>
			<div className={classes.rowContent}>
				<ReduxFormInput defaultValue="">
					<TextInput placeholder="TextInput" />
				</ReduxFormInput>
				<div className={classes.rowControl}>
					<ReduxFormInput defaultValue={false}>
						<Checkbox label="Control checkbox" />
					</ReduxFormInput>
				</div>
			</div>
		</div>

		<div className={classes.row}>
			<div className={classes.rowLabel}>Checkbox</div>
			<div className={classes.rowContent}>
				<ReduxFormInput defaultValue={false}>
					<Checkbox label="Checkbox 1" inline />
				</ReduxFormInput>
				<ReduxFormInput defaultValue>
					<Checkbox label="Checkbox 2" inline />
				</ReduxFormInput>
				<ReduxFormInput defaultValue={false}>
					<Checkbox label="Checkbox 3" inline />
				</ReduxFormInput>
			</div>
		</div>

		<div className={classes.row}>
			<div className={classes.rowLabel}>Radios</div>
			<div className={classes.rowContent}>
				<ReduxFormInput defaultValue="LOW">
					<RadioGroup
						items={{
							low: {
								value: 'LOW',
								label: 'Low Priority',
								inline: true,
							},
							normal: {
								value: 'MID',
								label: 'Medium priority',
								inline: true,
							},
							high: {
								value: 'HIGH',
								label: 'High priority',
								inline: true,
							},
						}}
					/>
				</ReduxFormInput>
			</div>
		</div>

		<div className={classes.row}>
			<div className={classes.rowLabel}>Switches</div>
			<div className={classes.rowContent}>
				<label className="pt-control pt-switch" htmlFor="switchId1">
					<input type="checkbox" id="switchId1" />
					<span className="pt-control-indicator" />
					Switch
				</label>
			</div>
		</div>

		<div className={classes.row}>
			<div className={classes.rowLabel}>Select</div>
			<div className={classes.rowContent}>
				<ReduxFormInput defaultValue="foo">
					<Select
						items={[
							{
								id: 'foo',
								label: 'Simple item',
							},
							{
								id: 'bar',
								label: 'Clickable item',
							},
						]}
					/>
				</ReduxFormInput>
			</div>
		</div>

		<div className={`${classes.row} ${classes.iconLabeled}`}>
			<div className={classes.rowLabel}>
				<span className="pt-icon-standard pt-icon-projects" />
			</div>
			<div className={classes.rowContent}>
				<ReduxFormInput defaultValue="">
					<TextInput placeholder="TextInput" />
				</ReduxFormInput>
			</div>
		</div>

		<div className={`${classes.row} ${classes.iconLabeled}`}>
			<div className={classes.rowLabel}>
				<span className="pt-icon-standard pt-icon-people" />
			</div>
			<div className={classes.rowContent}>
				<ReduxFormInput defaultValue="">
					<TextInput placeholder="TextInput" />
				</ReduxFormInput>
			</div>
		</div>

		<div className={classes.actionsBar}>
			<Button type="submit" text="Add" className={classes.controlBtn} />
			<Button text="Cancel" className={classes.controlBtn} />
		</div>
	</form>
));
