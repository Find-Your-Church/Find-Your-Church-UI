import React, {Component} from "react";

class FilterItemCheck extends Component{
	constructor(props){
		super(props);

		this.checks = this.props.value.split("");
	}

	onCheck = e => {
		this.checks[e.target.value] = e.target.checked ? '1' : '0';
		this.props.send(this.checks.join(""));
	};

	render(){
		// console.log(this.props.filterName, this.props.value);
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
								<input type="checkbox" id={this.props.filterName + "[" + index + "]"}
									   value={index} onClick={this.onCheck}
									   checked={this.checks[index] === '1'}
								/>
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
