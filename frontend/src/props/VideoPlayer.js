import React, { Component } from 'react';
import ReactPlayer from 'react-player'

export default class VideoPlayer extends Component {

	constructor(props) {
		super(props);
		let { name } = props.match.params;

		this.state = {
			playing: false,
			playbackRate: 1,
			volume: 1,
		};

		this.duration = 0;
		this.name = name;
		this.player = React.createRef();
	}

	onClick() {
		this.setState({
			...this.state,
			playing: !this.state.playing
		});
	}

	componentDidMount() {
		document.addEventListener("keydown", (k) => this.handleKeyPress(k), false);
	}

	handleKeyPress(keyEvent) {
		console.log("STATE:", this.state);
		let { key } = keyEvent;
		let secs = 0;
		let newVolume = 0;
		switch(key) {
			case 'ArrowUp':
			case 'k':
				newVolume = this.state.volume + 0.1;
				this.setState({
					...this.state,
					volume: Math.min(1, newVolume)
				});
				break;
			case 'ArrowDown':
			case 'j':
				newVolume = this.state.volume - 0.1;
				this.setState({
					...this.state,
					volume: Math.max(0, newVolume),
				});
				break;
			case 'ArrowLeft':
			case 'h':
				secs = this.player.getCurrentTime();
				this.player.seekTo(Math.max(0, secs + 10));
				break;
			case 'ArrowRight':
			case 'l':
				secs = this.player.getCurrentTime();
				this.player.seekTo(Math.min(this.duration, secs - 10));
				break;
			case '{':
				this.setState({
					...this.state,
					playbackRate: this.state.playbackRate - 0.1,
				});
				break;
			case '}':
				this.setState({
					...this.state,
					playbackRate: this.state.playbackRate + 0.1,
				});
				break;
			case ' ':
				this.setState({
					...this.state,
					playing: !this.state.playing,
				});
				break;
			default:
		}
	}

	render() {
		return (
			<div>
				<ReactPlayer
					ref={(p) => {
						this.duration = p.getDuration();
						this.player = p;
					}}
					height='90%'
					width='100%'
					url={"/video/" + this.name }
					controls
					onClick={() => this.onClick()}
					onKeyPress={(key) => this.handleKeyPress(key)}
					{...this.state}
				/>
			</div>
		);
	}
}
