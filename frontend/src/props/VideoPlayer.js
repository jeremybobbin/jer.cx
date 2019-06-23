import React, { Component } from 'react';
import ReactPlayer from 'react-player'

export default class VideoPlayer extends Component {

	constructor(props) {
		super(props);

		let { name } = props.match.params;

		this.state = {
			name,
		}
	}

	render() {
		return (
			<ReactPlayer url={"/video/" + this.state.name } playing controls volume={1} />
		);
	}
}
