import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Jer from './assets/jer.png';
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
						<Route path="/links" component={Downloads} />
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
				<div className="me">
					<h1>About Me</h1>
					<div className="jer-face-wrapper">
						<img src={Jer} className="jer-face"/>
					</div>
					<p className="first">
							I'm Jeremy and I'm 20 years old. I was born and raised in Orlando, Florida. <a href="resume.pdf">This</a> is my resume.
					</p>
					<br />
					<p>
							I aspire to live my life in accordance with the Unix philosophy. I enjoy optimizing my own work flow through the use of the modular and exstensible core utilities. Though I aim to write most of my shell commands as one-liners, I still resort to Bash for-loops from time to time. If you have similar aspirations, <a href="mailto:jer@jer.cx">email me</a>.
					</p>
					<br/>
					<p>
							I like keyboard-driven applications, like <a href="https://www.vim.org">Vim</a>, <a href="https://www.qutebrowser.org">Qutebrowser</a> and <a href="https://dwm.suckless.org/">DWM</a>. Though I'm very pleased with Vim in many ways, I am somewhat disspointed with the lack of modularity.
					</p>
					<br />
					<p>
							I'd like to retire at 30, and move to Panama or equally cheap place, as I'm relatively minimalistic. I'm currently running a modded Lenovo ThinkPad T420. The Thinkpad hosts an <a href="https://ark.intel.com/content/www/us/en/ark/products/71255/intel-core-i7-3540m-processor-4m-cache-up-to-3-70-ghz.html">Intel i7-3540M</a>(not possible with the stock bios) which is sufficient for my day to day activities. It's also got a 1920 by 1080 IPS display(the difference between the IPS panel and the stock panel is <i>night and day</i>). The next modification will be to replace the motherboard with its <i>NVidia on-board graphics</i> variety, so that I could graphically accelerate my VM's should I want to do so.
					</p>
				</div>
				<div className="this-site">
					<h1>About This Site</h1>
					<p>
							This site is written with <a href="https://reactjs.org/">React</a>, served with the help of <a href="https://rocket.rs/">Rocket</a>, a web framework written in <a href="https://www.rust-lang.org">Rust</a>.
					</p>
				</div>
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
					<li><Link to="/links">Links</Link></li>
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
