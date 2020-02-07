import React, {Component} from "react";
import SiteFooter from "../components/site-footer";

class Notfound extends Component{
	render(){
		return (
			<main>
				<div className="notfound-body">
					<h3 className="w3-display-middle">
						Oops, :(<br/> the page was not found.
					</h3>
				</div>
			</main>
		);
	}
}

export default Notfound;
