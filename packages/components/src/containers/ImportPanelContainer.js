/* eslint function-paren-newline:0 */
import { connect } from 'react-redux';
import { DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { acceptFile, uploadingSelector } from '@hitask/modules/import';
import ImportPanel from '../presentational/ImportPanel';

const mapActionCreators = {
	acceptFile,
};

const mapStateToProps = state => ({
	isLoading: uploadingSelector(state),
});

const dropTarget = {
	drop(props, monitor) {
		const draggedObject = monitor.getItem();
		props.acceptFile(draggedObject.files[0]);
	},
};

const collectDrop = (connector, monitor) => ({
	connectDropTarget: connector.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
});

export default connect(mapStateToProps, mapActionCreators)(
	DropTarget([NativeTypes.FILE], dropTarget, collectDrop)(ImportPanel)
);
