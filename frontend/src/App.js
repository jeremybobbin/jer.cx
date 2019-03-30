import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Hannibal from './assets/hanibal.png';
import Downloads from './Downloads.js';

class App extends Component {
	constructor(props) {
		super(props);
	}
	// componentWillMount() {
	// 	document.addEventListener("keydown", this.onKeyPressed.bind(this));
	// }

	// componentWillUnmount() {
	// 	document.removeEventListener("keydown", this.onKeyPressed.bind(this));
	// }      

	render() {
		return (
			<BrowserRouter>
				<Base keydown={(e) => this.key(e)}>
					<div>
						<Route exact path="/" component={Main} />
						<Route path="/downloads" component={Downloads} />
						<Route path="/about" component={About} />
					</div>
				</Base>
			</BrowserRouter>
		);
	}
}

class Base extends Component {
	render() {
		return (
			<React.Fragment>
				<Header />
					{this.props.children}
				<Footer />
			</React.Fragment>
		);
	}
}

class About extends Component {
	render() {
		return (
			<div className="about">
				<h1>About</h1>
				<p>
						I'm Jeremy.
						This site is written with <a href="https://reactjs.org/">React</a>, served with the help of <a src="https://rocket.rs/">Rocket</a>, a web framework written in rust.
				</p>
			</div>
		);
	}
}

class Header extends Component {
	
	render() {
		return (
			<header   className="header">
				<ul className="nav-bar">

					<li><Link to="/" className="site-name">Jer.cx</Link></li>
					<li><Link to="/downloads">Downloads</Link></li>
					<li><Link to="/about">About</Link></li>

					{/*
					<li className="dropdown" >
						<a href="#" className="dropbtn">Dropdown</a>
						    <div className="dropdown-content">
								<a href="#">Link 1</a>
								<a href="#">Link 2</a>
								<a href="#">Link 3</a>
							</div>
					</li>
					*/}
				</ul>
			</header>
		);
	}
}

class Main extends Component {
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
				<h2>Coming real soon...</h2>
			</main>
		)
	}
}

class Footer extends Component {
	render() {
		return (
			<footer className="footer">
				<div className="outro">
					<h4>
						<a href="https://www.github.com/jeremybobbin">Github</a>
					</h4>
					<h4>
						<a href="mailto:jer@jer.cx">Email</a>
					</h4>
					<h4>
						<a href="https://www.github.com/jeremybobbin/jer.cx">Source</a>
					</h4>
				</div>
			</footer>
		)
	}
}





export default App;
