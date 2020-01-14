import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'w3-css/w3.css';
import './App.css';
import SiteHeader from "./components/site-header";
import Home from "./pages/home";
import SearchResults from "./pages/search-results";

class App extends Component{
	render(){
		return (
			<Router>
				<SiteHeader/>
				<Route path="/" exact component={Home}/>
				<Route path="/search-result" component={SearchResults}/>
				<Route path="/dashboard-community" component={SearchResults}/>
			</Router>
		);
	}
}

export default App;
