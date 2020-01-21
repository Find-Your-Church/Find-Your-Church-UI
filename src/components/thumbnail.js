import React, {Component} from "react";
import {Link} from "react-router-dom";

class Thumbnail extends Component{
	render(){
		return (
			<div className="listing-container1">
				<div className="listingprofilepic-div">
					<img
						src={
							this.props.value.picture ? this.props.value.picture
								: "/img/community-default.jpg"}
						alt="" className={"image" + (this.props.value.picture ? "" : " w3-opacity-max")}/>
				</div>
				<div className="listinginfo-div">
					<div className="listingrow">
						<div data-collapse="all" data-animation="default" data-duration="400"
							 className="listing-nav w-nav">
							<Link to="#" className="communityname">{this.props.value.community_name}</Link>
							<nav role="navigation" className="listing-navmenu w-nav-menu">
								<Link to="/profile-edit" className="listing-navlink w-nav-link">Edit</Link>
								<Link to="#" className="listing-navlink w-nav-link">Activate</Link>
								<Link to="#" className="listing-navlink w-nav-link">Delete</Link>
							</nav>
							<div className="listingnav-button w-nav-button">
								<img src="/img/3dot-icon.png" alt="" className="threedoticon"/>
							</div>
							<div className="w-nav-overlay" data-wf-ignore="">
							</div>
						</div>
					</div>
					<div className="listingrow">
						<h5 className="communitycategory">{this.props.value.category}</h5>
					</div>
					<div className="listingrow">
						<h5 className="communityaddress">{this.props.value.address}</h5>
					</div>
				</div>
			</div>

		);
	}
}

export default Thumbnail;
