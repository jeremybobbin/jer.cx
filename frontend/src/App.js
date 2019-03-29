import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<Header />
				<Main />
				<Footer />
			</React.Fragment>
		);
	}
}

class Header extends Component {
	render() {
		return (
			<header className="header">
					This is the Jer Header.
					Gimme yer cash
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
				Footer
			</footer>
		)
	}
}


export default App;
