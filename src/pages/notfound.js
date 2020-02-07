import React, {Component} from "react";
import "../css/404.css";

class Notfound extends Component{
	render(){
		return (
			<main>
				<div className="notfound-body">
					<div className="w3-display-middle w3-text-gray">
						<h1 className={"jumbo-title"}>404</h1>
						<p>Oops, :(<br/> the page was not found.</p>
					</div>
				</div>
			</main>
		);
	}
}

export default Notfound;
