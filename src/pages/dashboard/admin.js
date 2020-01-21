import React, {Component} from "react";
import '../css/dashboard.css';
import '../css/admin.css';
import ProfileContainer from "../../components/profile-container";
import MyCommunities from "../../components/my-communites";
import DashboardHeader from "../../components/dashboard-header";
import SiteFooter from "../../components/site-footer";

class Admin extends Component{
	render(){
		return (
			<div>
				<DashboardHeader/>
				<main className="admin-body w3-row">
					<div className="admin-left w3-col">
						<ProfileContainer/>
					</div>
					<div className="admin-right w3-rest">
						<MyCommunities status="active"/>
						<MyCommunities status="inactive"/>
					</div>
				</main>
				<SiteFooter/>
			</div>
		);
	}
}

export default Admin;
