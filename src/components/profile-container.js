import React, {Component} from "react";
import {Link} from "react-router-dom";

class ProfileContainer extends Component{
	constructor(props){
		super(props);

		this.state = {
			collapsedBio: true,
			collapsedContact: true,
			collapsedResources: true,
		};

		this.toggleBio = this.toggleBio.bind(this);
		this.toggleContact = this.toggleContact.bind(this);
		this.toggleResources = this.toggleResources.bind(this);
	}

	toggleBio(){
		this.setState({collapsedBio: !this.state.collapsedBio});
	}

	toggleContact(){
		this.setState({collapsedContact: !this.state.collapsedContact});
	}

	toggleResources(){
		this.setState({collapsedResources: !this.state.collapsedResources});
	}

	render() {
		return (
			<div className="profile-container">
				<div className="div-block-55">
					<div className="profpic-container">
						<div className="profpic-div">
							<img
								src="/uploaded/profiles/5de7326365d48a7932daf64f_Headshot-p-500.jpg"
								srcSet="/uploaded/profiles/5de7326365d48a7932daf64f_Headshot-p-500.jpg 500w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5de7326365d48a7932daf64f_Headshot-p-800.jpeg 800w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5de7326365d48a7932daf64f_Headshot.JPG 1080w"
								sizes="94px" alt="" className="image-4"/>
						</div>
					</div>
				</div>
				<div className="div-block-56">
					<div className="profile-info">
						<div data-collapse="all" data-animation="default" data-duration="400"
							 className="listing-navbar w-nav">
							<h3 className="community-name">Justin Wheelock</h3>
							<nav role="navigation" className="listing-navmenu w-nav-menu">
								<Link to="#" className="listing-navlink w-nav-link">Edit</Link>
							</nav>
							<div className="menu-button w-nav-button">
								<img
									src="/img/3dot-icon.png"
									alt="" className="threedoticon"/></div>
							<div className="w-nav-overlay" data-wf-ignore="">

							</div>
						</div>
						<div className="accordion-section">
							<div className="accordion-item">
								<div className="trigger-div" onClick={this.toggleBio}>
									<div className="div-block-20">
										<h4 className="accordion-label">Bio</h4>
									</div>
									<div className="accordion-content"
										 style={{height: this.state.collapsedBio ? "0" : "auto"}}>
										<div className="div-block-19">
											<p className="content-text">Users response to question.</p>
										</div>
									</div>
								</div>
							</div>
							<div className="accordion-item">
								<div className="trigger-div" onClick={this.toggleContact}>
									<div className="div-block-20">
										<h4 className="accordion-label">Contact</h4>
									</div>
									<div className="accordion-content"
										 style={{height: this.state.collapsedContact ? "0" : "auto"}}>
										<div className="div-block-19">
											<p className="content-text">Users response to question.</p>
										</div>
									</div>
								</div>
							</div>
							<div className="accordion-item">
								<div className="trigger-div" onClick={this.toggleResources}>
									<div className="div-block-20">
										<h4 className="accordion-label">Links and Resources</h4>
									</div>
									<div className="accordion-content"
										 style={{height: this.state.collapsedResources ? "0" : "auto"}}>
										<div className="div-block-19">
											<p className="content-text">
												Users response to question.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileContainer;
