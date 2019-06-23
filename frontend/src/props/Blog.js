import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

export default class Blog extends Component {
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
		let { name } = this.state.props.match.params;
		if (name) {
			return (<BlogText name={name}/>);
		} else {
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
}

class BlogText extends Component {

	constructor(props) {
		super(props);

		let { name } = props;

		this.state = {
			name,
			body: '',
		}
	}

	componentDidMount() {
		fetch(`/posts/${this.state.name}`)
			.then((body) => body.text())
			.then((body) => {
				this.setState({
					...this.state,
					body,
				});
			}).catch((e) => console.log(e))
	}



	render() {

		return (
			<div>
				<h1>{ this.state.name }</h1>
				<p>{ this.state.body }</p>
			</div>
		);
	}
}
