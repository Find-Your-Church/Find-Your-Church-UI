import React, {Component} from "react";
import SiteFooter from "../components/site-footer";

class Notfound extends Component{
	render(){
		return (
			<main>
				<div className="sign-body">
					<h3 className="w3-display-middle">
						Oops, :(<br/> the page was not found.
					</h3>
				</div>
				<SiteFooter/>
			</main>
		);
	}
}

export default Notfound;
