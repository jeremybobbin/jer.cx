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
			<div>
				<ul>
					{ this.state.blogs.map((b) => 
						<li style={{padding: "0.5em"}} >
							<Link to={'/blog/' + b.name.replace(/ /g, '_')}>{b.name} - Published: {b.modified}</Link>
						</li>
					)}
				</ul>
			</div>
		);
	}
}

