import React, {Component} from "react";

class FilterItemRadio extends Component{
	constructor(props){
		super(props);

		this.checks = "0".repeat(props.items.length);
	}

	onCheck = e => {
		this.checks = "0".repeat(e.target.value) + '1' + "0".repeat(this.props.items.length - e.target.value - 1);
		this.props.send(this.checks);
	};

	render(){
		// console.log(this.props.filterName, this.state.checks);
		return (
			<div className="filter-div">
				<div className="flexdiv-left labels">
					<label className="filter-label">{this.props.filterTitle}</label>
					<img
						src="/img/tooltip-icon.png"
						alt="" className="tooltip-icon"/>
				</div>
				{
					this.props.items.map((item, index) => {
						return (
							<label className="filter-option" key={this.props.filterName + index}>{item}
								<input type="radio" id={this.props.filterName + "[" + index + "]"} name={this.props.filterName} value={index} onClick={this.onCheck}/>
								<span className="filter-radiomark"> </span>
							</label>
						)
					})
				}
			</div>
		)
	}
}

export default FilterItemRadio;
