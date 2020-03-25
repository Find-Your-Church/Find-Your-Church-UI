import React, {Component} from 'react';
import {connect} from "react-redux";
import '../css/preview-frame.css';
import {Link} from "react-router-dom";

class PreviewSearchResults extends Component{
	constructor(props){
		super(props);

		const {name, criteria} = props.match.params;
		this.criteria = criteria;

		this.state = {
			name: name.replace(/-/g, " "),
			frameUrl: '',
		};
	}

	componentDidMount(){
		const preview_url = `${window.location.protocol}//${window.location.host}/search-results-iframe/${this.criteria}`;

		this.setState({
			frameUrl: preview_url,
		});
	}

	render(){
		return (
				<div className={"preview-frame-wrapper"}>
					<div className={"preview-frame-header"}>
						<div className="div-block-185"><Link to="/dashboard/account" className="button-6 w-button-back">
							<i className={"fas fa-chevron-circle-left"}></i>
							&nbsp;&nbsp;&nbsp;Back to Account</Link>
						</div>
						<h1 className="heading-28">Preview {this.state.name}'s Communities</h1>
					</div>
					<iframe className={"preview-frame"} src={this.state.frameUrl}></iframe>
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
