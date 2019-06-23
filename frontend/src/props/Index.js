import React, { Component } from 'react';
import Game from './Game.js';

export default class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imgSrc: ''
		}
	}
	onKeyPressed(e) {
		if(e.key === "ArrowDown") {
			this.newImage();
		}
	}
	componentWillMount() {
		document.addEventListener("keydown", this.onKeyPressed.bind(this));
		this.newImage();
	}

	newImage() {
		fetch('https://cataas.com/cat/cute')
			.then(response => response.blob())
			.then(images => {
				let imgSrc = URL.createObjectURL(images);
				console.log(imgSrc);
				this.setState({ imgSrc });
			})
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.onKeyPressed.bind(this));
	}      

	render() {
		return (
			<main className="main">
				<img src={this.state.imgSrc} alt="Dang" />
				<Game />
			</main>
		)
	}
}


