import React, { Component } from 'react';

export default class Game extends Component {
	constructor(props) {
		super(props);
		this.state ={
			playing: false,
			done: false,
			timer: 10,
			text: {
				header: "Button Game",
				button: "Play"
			},
			count: 0
		}
	}

	handle() {
		if (this.state.playing) {
			let newCount = this.state.count + 1;
			this.setState({
				...this.state,
				count: newCount,
				text: {
					...this.state.text,
					button: newCount
				}
			});
		} else if (this.state.done) {
			this.reset();
		} else {
			this.start();
		}
	}

	decr() {
		let newTime = this.state.timer - 1;
		if (newTime > 0) {
			this.setState({
				...this.state,
				timer: newTime,
				text: {
					...this.state.text,
					header: newTime
				}
			});
			setTimeout(() => this.decr(), 1000);
		} else {
			this.stop();
		}
	}

	reset() {
		this.setState({
			playing: false,
			done: false,
			timer: 10,
			text: {
				header: "Button Game",
				button: "Play"
			},
			count: 0
		});
	}

	stop() {
		this.setState({
			...this.state,
			playing: false,
			done: true,
			count: 0,
			disabled: true,
			text: {
				header: `You scored ${this.state.count}`,
				button: "Reset",
			},
		});
		setTimeout(() => {
			this.setState({
				...this.state,
				disabled: false
			})
		}, 2500);
	}

	start() {
		this.setState({
			...this.state,
			playing: true,
			interval: setTimeout(() => this.decr(), 1000),
			text: {
				header: this.state.timer,
				button: "Click Me",
			},
		});
	}

	render() {
		let {header, button} = this.state.text;
		return (
			<div className="game">
				<h2 className="count">{header}</h2>
				<button className="button" disabled={this.state.disabled} onClick={() => this.handle()}>
						{button}
				</button>
			</div>
		)
	}
}
