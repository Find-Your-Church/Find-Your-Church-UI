import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from "react-places-autocomplete";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {doSearchCommunities, setSearchCriteria} from "../actions/community-actions";
import community_config from "../conf/community-conf";

class SearchBar extends Component{
	constructor(props){
		super(props);

		this.state = {
			search_category: this.props.community.criteria.category,
			search_radius: this.props.community.criteria.radius,
			my_address: this.props.community.criteria.address,
			my_lat: this.props.community.criteria.lat,
			my_lng: this.props.community.criteria.lng,

			ready2go: false,
		};

		this.onChangeAddress = this.onChangeAddress.bind(this);
	}

	onChange = e => {
		if(e.target.id === 'search_radius'){
			const rad = parseInt(e.target.value);
			this.setState({[e.target.id]: rad});

			this.props.setSearchCriteria({
				radius: rad,
			});

			this.props.doSearchCommunities({
				...this.props.community.criteria,
				radius: rad,
			});
		}
		if(e.target.id === 'search_category'){
			this.props.setSearchCriteria({
				category: e.target.value,
			});
			this.setState({[e.target.id]: e.target.value});
			this.props.setSearchCriteria({
				category: e.target.value,
			});
			this.props.doSearchCommunities({
				...this.props.community.criteria,
				category: e.target.value,
			});
		}
		else
			this.setState({[e.target.id]: e.target.value});
	};

	onChangeAddress = val => {
		this.setState({my_address: val, searchable: false});
	};

	handleSelect = address => {
		const self = this;
		// remove ", USA" from address.
		const trimmed_address = address.replace(", USA", "");
		self.setState({my_address: trimmed_address});

		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				self.setState({my_lat: latLng.lat, my_lng: latLng.lng});
				this.props.setSearchCriteria({
					address: trimmed_address,
					lat: latLng.lat,
					lng: latLng.lng,
				});
				this.props.doSearchCommunities({
					...this.props.community.criteria,
					address: trimmed_address,
					lat: latLng.lat,
					lng: latLng.lng,
				});
			})
			.catch(error => console.error('Error', error));
	};

	handleSearch = () => {
		if(this.state.my_lat && this.state.my_lng){
			const clear_obj = {
				filter: {
					days: "0".repeat(community_config.FILTERS.days.length),
					times: "0".repeat(community_config.FILTERS.times.length),
					frequency: "0".repeat(community_config.FILTERS.frequency.length),
					ages: "0".repeat(community_config.FILTERS.ages.length),
					gender: "0".repeat(community_config.FILTERS.gender.length),
					parking: "0".repeat(community_config.FILTERS.parking.length),
					ministries: "0".repeat(community_config.FILTERS.ministries.length),
					other_services: "0".repeat(community_config.FILTERS.other_services.length),
					ambiance: "0".repeat(community_config.FILTERS.ambiance.length),
					event_type: "0".repeat(community_config.FILTERS.event_type.length),
					support_type: "0".repeat(community_config.FILTERS.support_type.length),
				}
			};

			// -> /search-results
			this.props.setSearchCriteria({
				category: this.state.search_category,
				radius: this.state.search_radius,
				address: this.state.my_address,
				lat: this.state.my_lat,
				lng: this.state.my_lng,
				...clear_obj
			});

			this.props.doSearchCommunities({
				...this.props.community.criteria,
				category: this.state.search_category,
				radius: this.state.search_radius,
				address: this.state.my_address,
				lat: this.state.my_lat,
				lng: this.state.my_lng,
				...clear_obj
			});

			// go to the search results!
			this.setState({ready2go: true});
		}
	};

	render(){
		const searchable = this.state.my_lat && this.state.my_lng;

		return this.state.ready2go && !this.props.init ? (
			<Redirect to={"/search-results"}/>
		) : (
			<div className="search-form-container w-form">
				<form id="search-form" name="email-form" data-name="Email Form" className="search-form">
					<div className={"criteria-group w3-row"}>
						<select id="search_category" onChange={this.onChange}
								defaultValue={this.props.community.criteria.category}
								style={{
									backgroundImage: "url('/img/icon-down3.svg')",
								}}
								className="search-form-dropdown w-node-5cf6ee0e50f1-ddb46e0f w-select w3-col s6">
							<option value="">Category...</option>
							{
								community_config.CATEGORIES.map(cat => {
									return (
										<option value={cat} key={"search-" + cat}>{cat}</option>
									);
								})
							}
						</select>
						<select id="search_radius" onChange={this.onChange}
								defaultValue={this.props.community.criteria.radius}
								style={{
									backgroundImage: "url('/img/icon-down3.svg')",
								}}
								className="search-form-dropdown w-node-5cf6ee0e50f2-ddb46e0f w-select w3-col s6">
							<option value="">Radius...</option>
							{
								community_config.SEARCH_RADIUS.map(r => {
									const pl = r > 1 ? "s" : "";
									return (
										<option value={r} key={"search-" + r}>within {r} mile{pl} of</option>
									);
								})
							}
						</select>
					</div>
					<PlacesAutocomplete
						style={{position: "relative"}}
						value={this.state.my_address}
						onChange={this.onChangeAddress}
						onSelect={this.handleSelect}
					>
						{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
							<>
								<input className="search-form-input w-node-5cf6ee0e50f3-ddb46e0f w-input"
									   title={`Lat: ${this.state.my_lat}, Lng: ${this.state.my_lng}, ${this.state.my_address}`}
									   {...getInputProps({
										   placeholder: this.props.community.criteria.address || "Address, City or Zip Code",
									   })}
									   required=""/>
								<div className={"search-address-candidates"}>
									{loading ?
										<div
											className={"w3-container w3-white we-text-grey w3-padding-large"}>...Loading</div> : null}
									{suggestions.map((suggestion) => {
										const style = {
											color: suggestion.active ? "#ffffff" : "#254184",
											backgroundColor: suggestion.active ? "#41b6e6" : "#e6e6e6",
											backgroundImage: "url('/img/icon/icon-address-fill.svg')",
										};

										return (
											<div className={"address-item"}
												 onClick={() => alert(suggestion.terms)}
												 {...getSuggestionItemProps(suggestion, {style})}>
												{suggestion.description}
											</div>
										);
									})}
								</div>
							</>
						)}
					</PlacesAutocomplete>
					<Link to={"#"}
						  onClick={searchable ? this.handleSearch : null}
						  className={"search-form-button w-button"}
						  style={{cursor: (searchable ? "pointer" : "not-allowed")}}
					>
						{this.props.buttonTitle}
					</Link>
				</form>
				<div className="w-form-done" style={{display: "none"}}>
					<div>Thank you! Your submission has been received!</div>
				</div>
				<div className="w-form-fail" style={{display: "none"}}>
					<div>Oops! Something went wrong while submitting the form.</div>
				</div>
			</div>
		);
	}
}

SearchBar.propTypes = {
	errors: PropTypes.object.isRequired,
	community: PropTypes.object.isRequired,
	setSearchCriteria: PropTypes.func.isRequired,
	doSearchCommunities: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	errors: state.errors,
	community: state.communities,
});

export default connect(
	mapStateToProps,
	{setSearchCriteria, doSearchCommunities}
)(SearchBar);
