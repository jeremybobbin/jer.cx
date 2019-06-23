import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

export default class Header extends Component {
	render() {
		return (
			<header   className="header">
				<ul className="nav-bar">

					<li><Link to="/" className="site-name">Jer.cx</Link></li>
					<li><Link to="/links">Links</Link></li>
					<li><Link to="/blog">Blog</Link></li>
					<li><Link to="/videos">Videos</Link></li>
					<li><Link to="/about">About</Link></li>
				</ul>
			</header>
		);
	}
}
