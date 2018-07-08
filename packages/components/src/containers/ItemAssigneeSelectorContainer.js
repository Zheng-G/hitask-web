import { connect } from 'react-redux';
import { selfProfileSelector } from '@hitask/modules/auth';
import { teammatesProfilesSelector } from '@hitask/modules/user';
import ItemAssigneeSelector from '../presentational/ItemAssigneeSelector';

const mapActionCreators = {};

const mapStateToProps = state => ({
	selfProfile: selfProfileSelector(state),
	teammates: teammatesProfilesSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(ItemAssigneeSelector);
