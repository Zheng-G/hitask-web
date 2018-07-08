import { connect } from 'react-redux';
import { selfPictureHashSelector } from '@hitask/modules/auth';
import NavbarMini from '../presentational/NavbarMini';

const mapActionCreators = {};

const mapStateToProps = state => ({
	pictureHash: selfPictureHashSelector(state),
});

export default connect(mapStateToProps, mapActionCreators)(NavbarMini);
