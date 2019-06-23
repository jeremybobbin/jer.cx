import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

export default class Blogs extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			props,
			blogs: [],
		}
	}

	componentDidMount() {
		fetch('/posts')
			.then((body) => body.json())
			.then((blogs) => {
				this.setState({
					...this.state,
					blogs,
				});
			})
			.catch((err) => console.log('Error', err));
	}


	render() {
		return (
			<ul>
				{ this.state.blogs.map((b) => 
					<li>
						<Link to={'/blog/' + b.name}>{b.name}</Link>
					</li>
				)}
			</ul>
		);
	}
}

