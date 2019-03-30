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

function dateString(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate() + 1;
	let year =  date.getYear() - 100;
	let dayString = (day < 10 && "0" + day) || day.toString();
	let monthString = (month < 10 && "0" + month) || month.toString();
	return `${monthString}-${dayString}-20${year}`
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

				// Refer to GitHub's documentation forr obscure datastructure details
				let newRepos = [];

				// Initialize repo object for display
				for (let i in repos) {
					let limit = 16;
					let repo = repos[i];
					let date = new Date(Date.parse(repo.pushed_at));
					repo.date = date;
					repo.dateString = dateString(date);
					repo.fullName = repo.name;
					if (repo.name.length > limit) {
						repo.name = repo.name.slice(0, limit) + '...' ;
					}
					newRepos.push(repo);
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
			<div className="repos">
				<h1 className="repos-title">
					GitHub
				</h1>
					<table>
						<thead className="table-header">
							<tr >
								<th>Repository</th>
								<th>Last Commit</th> 
							</tr>
						</thead>
						<tbody>
							{this.state.repos.map(( repo, i ) => 
								<tr key={i} className="repo">
									<td>
										{/* Place 'title' attribute if name is abbridged.*/}
										<a className="html-link" title={repo.name !== repo.fullName && repo.fullName || ""} href={repo.html_url}>
											{repo.name}
										</a>
									</td>
									<td>
										<span className="repo-name">
												{ repo.dateString }
										</span>
									</td>
									<td>
										<a className="dl-link" href={repo.downloads_url}>
											<Icon />
										</a>
									</td>
								</tr>
							)}
						</tbody>
					</table>
			</div>
		)
	}
}




export default App;
