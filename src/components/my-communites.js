import React, {Component} from "react";
import "../css/communities.css"
import Thumbnail from "./thumbnail";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getMyCommunities} from "../actions/community-actions";
import formatNumber from "../utils/formatNumber";
import Popup from "reactjs-popup";

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
							<div className="container-header">
								{this.props.status.replace(/^\w/, c => c.toUpperCase())} Communities
								{this.props.status === "active" ? (
									<div className={"counter-part"}>
										<div className={"counter-part-border"}>
										{formatNumber(this.props.community.my_communities.active.length)}
										&nbsp;/&nbsp;
										{this.props.community.subscription ?
											formatNumber(this.props.community.subscription.quantity + this.props.community.tickets)
											: (this.props.community.is_sending ?
												<i className="fas fa-spinner fa-spin"> </i>
												: "00")}
										</div>
									</div>
								) : null}
								<Popup
									trigger={<i style={{cursor: "pointer"}}
												className={"fas fa-question-circle tooltip-icon"}> </i>}
									position={this.props.status === "active" ? "left top" : "left bottom"}>
									<div>Tell visitors more about your community...</div>
								</Popup>
							</div>
						</div>
					</div>
					<div className="div-20top">
						{this.props.communities[this.props.status].length > 0 ? (
								<div className="listing-grid dashboard">
									{this.props.communities[this.props.status].map((community, index) => {
										return (
											<Thumbnail key={this.props.status + index} status={this.props.status}
													   value={community} handleShowSubDlg={this.props.handleShowSubDlg}/>
										)
									})}
								</div>)
							: (
								<div className={"w3-normal w3-text-grey"}>
									You are not the Admin for any {this.props.status} communities.
								</div>
							)
						}
					</div>
				</div>
			</div>
		);
	}
}

MyCommunities.propTypes = {
	auth: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	communities: PropTypes.object.isRequired,
	getMyCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	community: state.communities,
	errors: state.errors,
	communities: state.communities.my_communities,
});

export default connect(
	mapStateToProps,
	{getMyCommunities}
)(MyCommunities);
