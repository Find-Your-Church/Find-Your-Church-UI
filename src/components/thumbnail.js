import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {activateCommunity, deactivateCommunity, deleteCommunity} from "../actions/community-actions";

class Thumbnail extends Component{
	constructor(props){
		super(props);

		this.state = {
			is_editing: false,
			is_viewing: false,
			is_show_menu: false,
		};

		this.goEdit = this.goEdit.bind(this);
		this.goView = this.goView.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);
		this.onActivate = this.onActivate.bind(this);
		this.onDeactivate = this.onDeactivate.bind(this);
		this.onDelete = this.onDelete.bind(this);
	}

	goEdit(e){
		// redirect to community-step with this.props.value (community object with full info).
		// console.log(this.props.value);

		this.setState({is_editing: true});
	}

	goView(e){
		// redirect to community-step with this.props.value (community object with full info).
		// console.log(this.props.value);

		this.setState({is_viewing: true});
	}

	toggleMenu(e){
		this.setState({is_show_menu: !this.state.is_show_menu});
	}

	hideMenu(e){
		this.setState({is_show_menu: false});
	}

	onActivate(e){
		this.props.handleShowSubDlg();

		const info = {
			community_id: this.props.value._id,
		};

		this.props.activateCommunity(info, this.props.history);
		this.setState({is_show_menu: false});
	}

	onDeactivate(e){
		const info = {
			community_id: this.props.value._id,
		};

		this.props.deactivateCommunity(info, this.props.history);
		this.setState({is_show_menu: false});
	}

	onDelete(e){
		const info = {
			community_id: this.props.value._id,
		};

		this.props.deleteCommunity(info, this.props.history);
		this.setState({is_show_menu: false});
	}

	render(){
		return (
			this.state.is_viewing ? (
				<Redirect to={{pathname: '/view', state: {obj: this.props.value}}}/>
			) : (
				this.state.is_editing ? (
					<Redirect to={{pathname: '/edit', state: {obj: this.props.value}}}/>
				) : (

					<div className="listing-container1" onMouseLeave={this.hideMenu}>
						<div
							className={"listingprofilepic-div" + (this.props.value.pictures.length > 0 ? "" : " w3-opacity-max")}
							style={{
								backgroundImage: `url('${this.props.value.pictures.length > 0 ? this.props.value.pictures[0]
									: "/img/community-default.jpg"}')`
							}}
							onClick={this.goView}>
						</div>
						<div className="listinginfo-div">
							<div className="listingrow">
								<div data-collapse="all" data-animation="default" data-duration="400"
									 className="listing-nav w-nav">
									<Link to="#" className="communityname" onClick={this.goView}>
										{this.props.value.community_name}
									</Link>
									<div className="listingnav-button w-nav-button" onClick={this.toggleMenu}>
										<img src="/img/3dot-icon.png" alt="" className="threedoticon"/>
									</div>
									<nav role="navigation" className="w3-animate-opacity listing-navmenu w-nav-menu"
										 style={{display: this.state.is_show_menu ? "block" : "none"}}>
										<Link to="#" className="listing-navlink w-nav-link" onClick={this.goEdit}>
											Edit
										</Link>
										<Link to="#" className="listing-navlink w-nav-link"
											  onClick={this.props.value.activated ? this.onDeactivate : this.onActivate}>
											{this.props.value.activated ? "Deactivate" : "Activate"}
										</Link>
										<Link to="#" className="listing-navlink w-nav-link" onClick={this.onDelete}>
											Delete
										</Link>
									</nav>
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
				)
			)
		);
	}
}

Thumbnail.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	activateCommunity: PropTypes.func.isRequired,
	deactivateCommunity: PropTypes.func.isRequired,
	deleteCommunity: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{activateCommunity, deactivateCommunity, deleteCommunity}
)(Thumbnail);
