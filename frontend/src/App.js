import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Base from './props/Base.js';
import About from './props/About.js';
import Downloads from './props/Downloads.js';
import Blog from './props/Blog.js';
import Blogs from './props/Blogs.js';
import Videos from './props/Videos.js';
import VideoPlayer from './props/VideoPlayer.js';
import Index from './props/Index.js';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<BrowserRouter>
				<Base>
					<div>
						<Route component={Index}		exact path="/" />
						<Route component={Blogs}		exact path="/blog" />
						<Route component={Blog}			exact path="/blog/:name" />
						<Route component={Downloads}	exact path="/links" />
						<Route component={Videos}		exact path="/videos" />
						<Route component={VideoPlayer}	exact path="/videos/:name" />
						<Route component={About}		exact path="/about" />
					</div>
				</Base>
			</BrowserRouter>
		);
	}
}
