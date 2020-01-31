import React, {Component} from "react";
import {Elements} from "react-stripe-elements";
import Account from "./account";

class AccountWrapper extends Component{
	render(){
		return(
			<Elements>
				<Account/>
			</Elements>
		);
	}
}

export default AccountWrapper;
