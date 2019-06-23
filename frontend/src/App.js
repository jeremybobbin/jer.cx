import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Base from './props/Base.js';
import About from './props/About.js';
import Downloads from './props/Downloads.js';
import Blog from './props/Blog.js';
import Videos from './props/Videos.js';
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
						<Route exact path="/" component={Index} />
						<Route exact path="/blog" component={Blog} />
						<Route path="/blog/:name" component={Blog} />
						<Route path="/links" component={Downloads} />
						<Route path="/video" component={Videos} />
						<Route path="/about" component={About} />
					</div>
				</Base>
			</BrowserRouter>
		);
	}
}
