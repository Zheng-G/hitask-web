import { connect } from 'react-redux';
import { localeSelector, dateFormatSelector } from '@hitask/modules/user';
import DateInput from '../../presentational/FormControls/DateInput';

const mapActionCreators = {};

const mapStateToProps = state => ({
	format: dateFormatSelector(state),
	locale: localeSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(DateInput);
