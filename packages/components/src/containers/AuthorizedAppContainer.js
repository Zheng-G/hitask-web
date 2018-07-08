import { connect } from 'react-redux';
import AuthorizedAppExt from '../presentational/AuthorizedApp';
import AuthorizedAppProvider from './AuthorizedAppProvider';

const mapActionCreators = {};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapActionCreators)(AuthorizedAppProvider(AuthorizedAppExt));
