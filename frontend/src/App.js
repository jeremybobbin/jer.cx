import React, { Component } from 'react';
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
				<ul className="nav-bar">
					<li><a className="site-name" href="/">Jer.cx</a></li>
					<li><a href="#">Ding</a></li>
					<li><a href="#">Dang</a></li>
					<li><a href="#">Dong</a></li>
					<li className="dropdown" >
						<a href="#" className="dropbtn">Dropdown</a>
						    <div className="dropdown-content">
								<a href="#">Link 1</a>
								<a href="#">Link 2</a>
								<a href="#">Link 3</a>
							</div>
					</li>
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
				Footer
			</footer>
		)
	}
}



export default App;
