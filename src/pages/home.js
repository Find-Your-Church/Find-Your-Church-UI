import React, {Component} from "react";
import '../css/home.css';
import SearchBar from "../components/search-bar";
import SiteFooter from "../components/site-footer";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserInfo} from "../actions/auth-actions";

/**
 *
 */
class Home extends Component{
	componentDidMount(){
		this.props.getUserInfo();
	}

	render(){
		return (
			<main className="home-main">
				<div className="block-48 w3-display-container">
					<div className="search-container w3-display-middle">
						<h1 className="search-form-header">What kind of community are you looking for?</h1>
						<SearchBar buttonTitle="Search"/>
					</div>
				</div>
				<div className="block-50">
					<div className="block-60">
						<iframe className="embedly-embed"
								src="//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F8rwsuXHA7RA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D8rwsuXHA7RA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F8rwsuXHA7RA%2Fhqdefault.jpg&amp;key=96f1f04c5f4143bcb0f2e68c87d65feb&amp;type=text%2Fhtml&amp;schema=youtube"
								scrolling="no" frameBorder="0" allow="autoplay; fullscreen"
								allowFullScreen={true} title="site main video">
						</iframe>
					</div>
				</div>
				<div className="block-51">
					<div className="div-block-84">
						<div className="div-block-85">
							<div className="div-block-86">
								<div>
									<img
										src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png"
										srcSet={"https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-500.png 500w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-1600.png 1600w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png 1884w"}
										sizes="(max-width: 479px) 53vw, (max-width: 767px) 254px, 14vw" alt=""/>
								</div>
								<div className="div-20top center"><h2>Search</h2></div>
								<div className="div-20top"><h4 className="paragraph">Browse local communities near you
									on one platform, from any device. </h4></div>
							</div>
						</div>
						<div className="div-block-85">
							<div className="div-block-86">
								<div>
									<img
										src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png"
										srcSet={"https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-500.png 500w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-1600.png 1600w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png 1884w"}
										sizes="(max-width: 479px) 53vw, (max-width: 767px) 254px, 14vw" alt=""/>
								</div>
								<div className="div-20top center"><h2>Search</h2></div>
								<div className="div-20top"><h4 className="paragraph">Browse local communities near you
									on one platform, from any device. </h4></div>
							</div>
						</div>
						<div className="div-block-85">
							<div className="div-block-86">
								<div>
									<img
										src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png"
										srcSet={"https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-500.png 500w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-1600.png 1600w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png 1884w"}
										sizes="(max-width: 479px) 53vw, (max-width: 767px) 254px, 14vw" alt=""/>
								</div>
								<div className="div-20top center"><h2>Search</h2></div>
								<div className="div-20top"><h4 className="paragraph">Browse local communities near you
									on one platform, from any device. </h4></div>
							</div>
						</div>
						<div className="div-block-85">
							<div className="div-block-86">
								<div>
									<img
										src="https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png"
										srcSet={"https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-500.png 500w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic-p-1600.png 1600w, https://uploads-ssl.webflow.com/5d8507ee478ff0afbe1aa918/5dfc418bef0cf979c4b6c141_Community%20Graphic.png 1884w"}
										sizes="(max-width: 479px) 53vw, (max-width: 767px) 254px, 14vw" alt=""/>
								</div>
								<div className="div-20top center"><h2>Search</h2></div>
								<div className="div-20top"><h4 className="paragraph">Browse local communities near you
									on one platform, from any device. </h4></div>
							</div>
						</div>
					</div>
				</div>
				<div className="block-52 teal">
				</div>
				<SiteFooter/>
			</main>
		);
	}
}

Home.propTypes = {
	auth: PropTypes.object.isRequired,
	getUserInfo: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
	auth: state.auth
});
export default connect(
	mapStateToProps,
	{getUserInfo}
)(Home);
