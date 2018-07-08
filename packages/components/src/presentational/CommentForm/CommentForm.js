import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentIcon from '@hitask/icons/item-view/comment.svg';
import EditableText from '../FormControls/EditableText';
import classes from './CommentForm.scss';

class CommentForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			comment: props.initialValue,
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onCommentChange = this.onCommentChange.bind(this);
		this.onCommentConfirm = this.onCommentConfirm.bind(this);
	}

	onCommentConfirm(comment) {
		if (!comment) return;
		this.props.handleSubmit({ comment });
		this.setState({
			comment: '',
		});
	}

	onSubmit(event) {
		event.preventDefault();
		this.onCommentConfirm(this.state.comment);
	}

	onCommentChange(value) {
		this.setState({
			comment: value,
		});
	}

	render() {
		return (
			<form onSubmit={this.onSubmit} className={classes.form} autoComplete="off">
				<CommentIcon className={classes.icon} />
				<EditableText
					input={{
						onChange: this.onCommentChange,
						value: this.state.comment,
					}}
					meta={{}}
					onConfirm={this.onCommentConfirm}
					wrapperClassName={classes.commentWrapper}
					className={classes.comment}
					placeholder="Add comment"
					maxLines={5}
					confirmOnEnterKey
				/>
			</form>
		);
	}
}

const { string, func } = PropTypes;
CommentForm.propTypes = {
	handleSubmit: func.isRequired,
	initialValue: string,
};

CommentForm.defaultProps = {
	initialValue: '',
};

export default CommentForm;
