import React, {Component} from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
//import store from "../reducers/store"

class ListCommunities extends Component{
	constructor(props){
		super(props);
		this.state = {
			email: "",
			password: "",
			errors: {}
		};
	}

	render(){
		const communities = [];// store.dispatch;
		return (
			<div className="communities-grid search-results">
				{communities.map(el => (
					<div className="card-container">
						<div className="profile-picture-container">
							<img
								src="/uploaded/profiles/5de01ae35abe8a57c55b9c2b_Five-tips-for-studying-with-friends.jpg"
								alt="" className="image"/>
						</div>
						<div className="info-container">
							<div data-collapse="all" data-animation="default" data-duration="400"
								 className="listing-navbar w-nav">
								<h3 className="community-name">
									<Link to="/community-profile" className="link-2">
										The Name of the Communi...
									</Link>
								</h3>
								<nav role="navigation" className="listing-navmenu w-nav-menu">
									<Link to="#" className="listing-navlink w-nav-link">Share</Link>
									<Link to="/profile-edit" className="listing-navlink w-nav-link">Hide</Link>
									<Link to="#" className="listing-navlink w-nav-link">Report</Link>
								</nav>
								<div className="menu-button w-nav-button">
									<img src="/img/3dot-icon.png" alt="" className="threedoticon"/>
								</div>
								<div className="w-nav-overlay" data-wf-ignore="">

								</div>
							</div>
							<h5 className="category">Category</h5>
							<h5 className="address">1234 Washington Avenue SE, Minne.....</h5>
						</div>
					</div>
				))}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	communities: state.communities
});

export default connect(mapStateToProps)(ListCommunities);
