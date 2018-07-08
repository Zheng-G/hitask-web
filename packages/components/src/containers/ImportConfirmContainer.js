import { connect } from 'react-redux';
import {
	cancel,
	createTasks,
	parsedEntitiesSelector,
	uploadingSelector,
} from '@hitask/modules/import';
import { Overlays, openOverlay } from '@hitask/modules/overlays';
import ImportConfirm from '../presentational/ImportConfirm';

const mapActionCreators = dispatch => ({
	cancel: () => dispatch(cancel()),
	createTasks: () =>
		dispatch(createTasks()).then(({ error }) => {
			if (error) return Promise.reject();
			return dispatch(
				openOverlay({
					name: Overlays.IMPORT_SUCCEED,
				})
			);
		}),
});

const mapStateToProps = state => ({
	items: parsedEntitiesSelector(state, 'items') || {},
	isLoading: uploadingSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ImportConfirm);
