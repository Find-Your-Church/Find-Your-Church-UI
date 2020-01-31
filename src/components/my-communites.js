import React, {Component} from "react";
import "../css/communities.css"
import Thumbnail from "./thumbnail";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {getMyCommunities} from "../actions/community-actions";

class MyCommunities extends Component{
	constructor(props){
		super(props);

		this.refresh = this.refresh.bind(this);

		this.refresh();
	}

	refresh(){
		this.props.getMyCommunities(this.props.auth.user.id, this.props.status === "active");
	}

	render(){
		return (
			<div className="communities-body">
				<div className="dashboard-container">
					<div className="containerheader-div underline">
						<div className="flexdiv-left">
							<h5 className="container-header">{this.props.status.replace(/^\w/, c => c.toUpperCase())} Communities</h5>
							<i className={"fas fa-question-circle tooltip-icon"}> </i>
						</div>
						{this.props.status === 'inactive' ?
							<Link to="/create-new-community" className="newcommunity-button w-button">+ New
								Community</Link>
							: null}
					</div>
					<div className="div-20top">
						{this.props.communities[this.props.status].length > 0 ? (
								<div className="listing-grid dashboard">
									{this.props.communities[this.props.status].map((community, index) => {
										return (
											<Thumbnail key={this.props.status + index} status={this.props.status} value={community} handleShowSubDlg={this.props.handleShowSubDlg}/>
										)
									})}
								</div>)
							: `You are not the Admin for any ${this.props.status} communities.`
						}
					</div>
				</div>
			</div>
		);
	}
}

MyCommunities.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	communities: PropTypes.object.isRequired,
	getMyCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
	communities: state.communities.my_communities,
});

export default connect(
	mapStateToProps,
	{getMyCommunities}
)(MyCommunities);
