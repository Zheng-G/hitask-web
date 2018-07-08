import { Position, Toaster as BlueprintToaster } from '@hitask/blueprint-core';
import classes from './Toaster.scss';

const Toaster = BlueprintToaster.create({
	className: classes.toaster,
	position: Position.TOP,
});

export default Toaster;
