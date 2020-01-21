import React, {Component} from "react";

class FilterItemCheck extends Component{
	constructor(props){
		super(props);

		this.checks = "0".repeat(props.items.length);
	}

	onCheck = e => {
		// console.log(e.target.value, e.target.checked);
		let checks = this.checks.split("");
		checks[e.target.value] = e.target.checked ? '1' : '0';
		this.checks = checks.join("");
		this.props.send(this.checks);
	};

	render(){
		// console.log(this.props.filterName, this.checks);
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
								<input type="checkbox" id={this.props.filterName + "[" + index + "]"} value={index} onClick={this.onCheck}/>
								<span className="filter-checkmark"> </span>
							</label>
						)
					})
				}
			</div>
		)
	}
}

export default FilterItemCheck;
