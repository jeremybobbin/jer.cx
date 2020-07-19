import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';


export default class Videos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			videos: []
		}
	}

	componentDidMount() {
		fetch('/video', {
			mode: 'no-cors',
		})
			.then((body) => body.json())
			.then((videos) => {
				this.setState({
					...this.state,
					videos,
				}, () => console.log(this.state));
			})
			.catch((err) => console.log('Error', err));
	}

	render() {
		return (
			<ul>
				{this.state.videos.map(( video, i ) => 
					<li key={i} className="video">
						<Link to={'/videos/' + video}>{video}</Link>
					</li>
				)}
			</ul>
		);
	}
}

