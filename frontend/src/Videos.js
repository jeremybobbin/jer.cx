import React, { Component } from 'react';
import Icon from './dl.js';

export default class Videos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: '',
			videos: []
		}
	}
	componentDidMount() {
		//fetch('/videos', {
		//	mode: 'no-cors',
		//})
		//	.then((vids) => vids.json())
		//	.then((videos) => {

		//		console.log(videos);
		//		videos.sort();

		//		this.setState({
		//			videos: videos
		//		}, () => console.log(this.state));
		//	})
		//	.catch((err) => console.log('Error', err));
		this.setState({
			...this.state,
			videos: [
				"1.mp4",
				"2.mp4",
				"3.mp4",
				"4.mp4",
			]
		});
	}

	setSelected(name) {
		this.setState({
			...this.state,
			selected: name,
		})
	}

	source() {
		if(this.state.selected) {
			return (
				<video width="640px" height="380px" controls>
					<source src="http://192.168.0.5:8000/video/10.mp4" type="video/mp4"/>
				</video>
			);
		} else {
			return <React.Fragment />;
		}
	}

	render() {
		const source = this.source();
		return (
			<div className="Videos">
				<ul>
					{this.state.videos.map(( video, i ) => 
						<li key={i} className="video">
							<a className="html-link" onClick={() => this.setSelected(video)}>
								{video}
							</a>
						</li>
					)}
				</ul>
					{ source }
			</div>
		);
	}
}
