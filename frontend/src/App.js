import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Base>
					<Route exact path="/" component={Main} />
					<Route path="/downloads" component={Downloads} />
					<Route path="/about" component={About} />
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
					{this.props.children || Base}
				<Footer />
			</React.Fragment>
		);
	}
}

class Downloads extends Component {
	render() {
		return (
			<React.Fragment>
				<h1>Downloads</h1>
			</React.Fragment>
		);
	}
}

class About extends Component {
	render() {
		return (
			<React.Fragment>
				<h1>About</h1>
			</React.Fragment>
		);
	}
}

class Header extends Component {
	render() {
		return (
			<header className="header">
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
	render() {
		return (
			<main className="main">
				Even more boilderplate
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
