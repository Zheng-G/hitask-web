import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './ExtOptions.scss';

class ExtOptions extends Component {
	componentWillMount() {
		const { getLocalWebappSession, loadPrefs } = this.props;
		getLocalWebappSession().then(({ payload: session }) => {
			if (!session) return null;
			return loadPrefs();
		});
	}
	render() {
		const { hasSession, logout, userName } = this.props;
		return (
			<div>
				<div className={classes.optionRow}>
					<div className={classes.optionLabel}>
						{hasSession ? `Signed in as ${userName}` : 'Not signed in'}
					</div>
					<div>
						<button
							type="submit"
							disabled={!hasSession}
							onClick={logout}
							className="pt-button"
						>
							Log out
						</button>
					</div>
				</div>
			</div>
		);
	}
}

const { func, string, bool } = PropTypes;
ExtOptions.propTypes = {
	hasSession: bool.isRequired,
	logout: func.isRequired,
	getLocalWebappSession: func.isRequired,
	loadPrefs: func.isRequired,
	userName: string,
};

ExtOptions.defaultProps = {
	userName: null,
};

export default ExtOptions;
