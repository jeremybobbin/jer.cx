import React, { Component } from 'react';

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

		return (
			<div>
				<h1>{ this.state.name }</h1>
				<p>{ this.state.body }</p>
			</div>
		);
	}
}
