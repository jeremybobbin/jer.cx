import React, { Component } from 'react';
import Icon from './dl.js';
import ReactPlayer from 'react-player'
import { Player } from 'video-react';
import ReactHLS from 'react-hls';


export default class Videos extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: '',
			videos: []
		}
	}
	componentDidMount() {
		fetch('/videos', {
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

	setSelected(name) {
		this.setState({
			...this.state,
			selected: name,
		})
	}

	source() {
		if(this.state.selected) {
			    
			return (
				<ReactPlayer url={"/video/" + this.state.selected} playing controls volume={1} />
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
