import React, { Component } from 'react';
const ReactMarkdown = require('react-markdown')

export default class Blog extends Component {

	constructor(props) {
		super(props);

		let { name } = props.match.params;

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
		let { name, body } = this.state;

		return (
			<div className="blog" >
				<h1>{ name.replace(/_/g, ' ' ) }</h1>
				<ReactMarkdown
					escapeHtml={ false }
					source={ body }
				/>
			</div>
		);
	}
}
