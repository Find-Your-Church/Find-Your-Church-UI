import React, {Component} from "react";
import '../../css/dashboard.css';
import '../../css/admin.css';
import ProfileContainer from "../../components/profile-container";
import MyCommunities from "../../components/my-communites";
import SiteFooter from "../../components/site-footer";
import StripeSubscription from "../../components/stripe-subscription";

class Admin extends Component{
	constructor(props){
		super(props);

		this.state = {
			showing_subscription: false,
		};

		this.showSubDlg = this.showSubDlg.bind(this);
		this.hideSubDlg = this.hideSubDlg.bind(this);
	}

	showSubDlg(community){
		console.log(community);
		this.setState({showing_subscription: true});
	}

	hideSubDlg(){
		this.setState({showing_subscription: false});
	}

	render(){
		return (
			<div>
				<div id={"stripe-modal"} className={"w3-modal"}
					 style={{display: this.state.showing_subscription ? "block" : "none"}}>
					<StripeSubscription handleHideSubDlg={this.hideSubDlg}/>
				</div>
				<main className="admin-body w3-row">
					<div className="admin-left w3-col">
						<ProfileContainer/>
					</div>
					<div className="admin-right w3-rest">
						<MyCommunities status="active" handleShowSubDlg={this.showSubDlg}/>
						<MyCommunities status="inactive" handleShowSubDlg={this.showSubDlg}/>
					</div>
				</main>
				<SiteFooter/>
			</div>
		);
	}
}

export default Admin;
