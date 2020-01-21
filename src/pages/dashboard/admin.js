import React, {Component} from "react";
import '../css/admin.css';
import ProfileContainer from "../../components/profile-container";

class Admin extends Component{
	render(){
		return (
			<main className="admin-body w3-row">
				<div className="admin-left w3-col">
					<ProfileContainer/>
				</div>
				<div className="w3-rest">

				</div>
			</main>
		);
	}
}

export default Admin;
