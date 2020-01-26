import React, {Component} from "react";
import {CardElement, injectStripe} from "react-stripe-elements";
import "./stripe-style.css";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {createCustomer} from "../actions/stripe-actions";

const cardStyle = {
	base: {
		color: "#32325d",
		"::placeholder": {
			color: "#aab7c4"
		}
	},
	invalid: {
		color: "#fa755a",
		iconColor: "#fa755a"
	}
};

class BillingCardInfo extends Component{
	constructor(props){
		super(props);

		this.state = {
			errors: {},
		};

		this.submit = this.submit.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.errors){
			return {errors: nextProps.errors};
		}
		else
			return null;
	}

	async submit(e){
		const {token} = await this.props.stripe.createToken({
			name: `${this.props.auth.user.fname} ${this.props.auth.user.lname}`,
		});

		if(token !== undefined)
			console.log("Token ID:", token.id);

		const customer_info = {
			source: token.id,
			email: this.props.auth.user.email,
		};

		console.log("token: ", token);

		this.props.createCustomer(customer_info, this.props.history);
		/*
		const customer = await this.props.stripe.customers.create({
			source: token.id,
			email: this.props.auth.user.email,
		});
		 */
	}

	render(){
		return (
			<>
				<h4 className="table-item">
					<CardElement className="CardInfoStyle" style={cardStyle}/>
				</h4>
				<Link to="#" className="table-link" onClick={this.submit}>Update</Link>
			</>
		);
	}
}

BillingCardInfo.propTypes = {
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	createCustomer: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors,
});

export default connect(
	mapStateToProps,
	{createCustomer}
)(injectStripe(BillingCardInfo));
