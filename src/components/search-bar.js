import React, {Component} from "react";
import {Link} from "react-router-dom";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from "react-places-autocomplete";

class SearchBar extends Component{
	constructor(props){
		super(props);

		this.state = {
			searchable: false,
			address: "",
			coordinate: {
				lat: null,
				lng: null,
			},
		};

		this.onChangeAddress = this.onChangeAddress.bind(this);
	}

	onChangeAddress = val => {
		this.setState({address: val, searchable: false});
	};

	handleSelect = address => {
		const self = this;
		self.setState({address: address});
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => {
				self.setState({coordinate: latLng, searchable: true});
			})
			.catch(error => console.error('Error', error));
	};

	render(){
		return (
			<div className="search-form-container w-form">
				<form id="search-form" name="email-form" data-name="Email Form" className="search-form">
					<select id="field" name="field" data-name="Field"
							className="search-form-dropdown w-node-5cf6ee0e50f1-ddb46e0f w-select">
						<option value="">Category...</option>
						<option value="">Church</option>
						<option value="life_groups">Life Groups</option>
						<option value="Third">Young Adult Groups</option>
					</select>
					<select id="field-2" name="field-2" data-name="Field 2"
							className="search-form-dropdown w-node-5cf6ee0e50f2-ddb46e0f w-select">
						<option value="">Radius...</option>
						<option value="1">within 1 mile of</option>
						<option value="3">within 3 miles of</option>
						<option value="5">within 5 miles of</option>
					</select>
					<PlacesAutocomplete
						style={{position: "relative"}}
						value={this.state.address}
						onChange={this.onChangeAddress}
						onSelect={this.handleSelect}
					>
						{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
							<>
								<input className="search-form-input w-node-5cf6ee0e50f3-ddb46e0f w-input"
									   title={`Lat: ${this.state.coordinate.lat}, Lng: ${this.state.coordinate.lng}, ${this.state.address}`}
									   {...getInputProps({placeholder: "315 1st Avenue SE, Minneapolis, MN 55413\" id=\"field-3"})}
									   required=""/>
								<div className={"search-address-candidates"}>
									{loading ?
										<div className={"w3-container w3-white we-text-grey"}>...loading</div> : null}
									{suggestions.map((suggestion) => {
										const style = {
											backgroundColor: suggestion.active ? "#41b6e6" : "#f8f8f8",
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
					<Link id="w-node-5cf6ee0e50f4-ddb46e0f" to={this.state.searchable ? "/search-results" : "#"}
						  className={"search-form-button w-button" + (this.state.searchable ? "" : " w3-grey w3-text-light-grey")}
						  style={{cursor: (this.state.searchable ? "pointer" : "not-allowed")}}
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

export default SearchBar;
