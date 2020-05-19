import React, {Component} from 'react';
import {connect} from "react-redux";
import '../css/preview-frame.css';
import {Link} from "react-router-dom";

class PreviewSearchResults extends Component{
	constructor(props){
		super(props);

		const {owner, category, radius, lat, lng, color, filter} = props.match.params;
		let owner_pcs = owner.split("-");
		this.owner = owner_pcs.pop(); // owner id
		this.category = category;
		this.radius = radius;
		this.lat = lat;
		this.lng = lng;
		this.color = color;
		this.filter = filter;

		this.state = {
			owner_name: owner_pcs.join(" "),
			frameUrl: '',
		};
	}

	componentDidMount(){
		const preview_url = `${window.location.protocol}//${window.location.host}/search-results-iframe/${this.owner}/${this.category}/${this.radius}/${this.lat}/${this.lng}/${this.color}/${this.filter}`;

		this.setState({
			frameUrl: preview_url,
		});
	}

	render(){
		return (
				<div className={"preview-frame-wrapper"}>
					<div className={"preview-frame-header"}>
						<div className="div-block-185"><Link to="/dashboard/account" className="button-6 w-button-back">
							<i className={"fas fa-chevron-circle-left"}/>
							&nbsp;&nbsp;&nbsp;Back to Account</Link>
						</div>
						<h1 className="heading-28">Preview {this.state.owner_name}'s Communities</h1>
					</div>
					<iframe className={"preview-frame"} src={this.state.frameUrl} title={"preview communities"}/>
				</div>
		);
	}
}

PreviewSearchResults.propTypes = {
};

const mapStateToProps = state => ({
});

export default connect(
		mapStateToProps,
		{}
)(PreviewSearchResults);
