import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Icon from './dl.js';
import Hannibal from './assets/hanibal.png';

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<Base>
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
					<img src={Hannibal} alt="Dang" />
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

class Downloads extends Component {
	render() {
		return (
			<div className="downloads">
				<Github />
			</div>
		);
	}
}

class Github extends Component {
	constructor(props) {
		super(props);
		this.state = {
			repos: []
		}
	}
	componentDidMount() {
		fetch('https://api.github.com/users/jeremybobbin/repos')
			.then((res) => res.json())
			.then((repos) => {
				console.log(repos);

				// GitHub gives an Object like {
				//	1: {
				//	 ...
				//	},
				//	2: {
				//   ...
				//	}
				//	...
				// }
				// Fun time.
				let newRepos = [];

				// Parse the given date string for sorting and display
				for (let i in repos) {
					repos[i].date = new Date(Date.parse(repos[i].pushed_at));
					newRepos.push(repos[i])
				}

				newRepos.sort((l, r) => r.date - l.date);

				this.setState({
					repos: newRepos
				}, () => console.log(this.state));
			})
			.catch((err) => console.log('Error', err));
	}
	render() {
		return (
			<React.Fragment>
				<h1>
					GitHub
				</h1>
				<ul>
					{this.state.repos.map(( repo, i ) => 
						<div key={i}>
							<li>
								<a className="html-link" href={repo.html_url}>
									{repo.name}
								</a>
								<a className="dl-link" href={repo.downloads_url}>
									<Icon />
								</a>
								<span>
										{`Last commit: ${ repo.date.getMonth() + 1}-${repo.date.getDate() + 1}-20${repo.date.getYear()-100}`}
								</span>
							</li>
						</div>

					)}
				</ul>
			</React.Fragment>
		)
	}
}




export default App;
