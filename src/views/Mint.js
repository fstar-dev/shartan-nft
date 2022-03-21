import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MintSection from '../components/Mint';

const Mint = (props) => {
	return (
		<>
			<MintSection />
		</>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		dispatch
	};
}

const mapsStateToProps = (state, ownProps) => {
	return {
		...ownProps,
		notification: state.app.notification
	}
}

export default withRouter(connect(
    mapsStateToProps, mapDispatchToProps
)(Mint));