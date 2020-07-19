import React, { Component } from 'react';

import Header from './Header.js';
import Footer from './Footer.js';

export default class Base extends Component {
	render() {
		return (
			<React.Fragment>
				<Header />
					{this.props.children}
				<Footer />
			</React.Fragment>
		);
	}
}
