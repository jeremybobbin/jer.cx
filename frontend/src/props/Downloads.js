import React, { Component } from 'react';
import Icon from './dl.js';

export default class Downloads extends Component {
	render() {
		return (
			<div className="downloads">
				<Github />
				<Misc />
			</div>
		);
	}
}

class Misc extends Component {
	constructor(props) {
		super(props);
		this.state =  {
			repos: [
				{
					name: 'CCNA Badge',
					url: 'https://www.youracclaim.com/badges/ca415d77-d8cb-4678-8167-9ba82a9c067d/public_url',
				},
				{
					name: 'LPIC-1 Certification PDF',
					url: '/LPIC-1.pdf',
				},
				{
					name: 'Resume PDF',
					url: '/resume.pdf',
				},
				{
					name: 'Resume',
					url: '/resume.html',
				},
			]
		};
	}
	render() {
		return (
			<div className="misc">
				<h1 className="misc-title">
						Misc
				</h1>
				<ul className="misc-list">
						{this.state.repos.map((repo, i) => 
							<li key={i} className="misc-item">
								<a href={repo.url}>
										{repo.name}
								</a>
							</li>
						)}
				</ul>
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

function dateString(date) {
	let mins = Math.floor((Date.now() - date) / (1000 * 60));

	if(mins < 1)
		return `Seconds ago`

	if (mins < 60)
		return `${mins} minute${mins > 1 && "s" || ""} ago`;

	let hours = Math.floor(mins / 60);
	if (hours < 24) 
		return `${hours} hour${hours > 1 && "s" || ""} ago`;

	let days = Math.floor(hours / 24);
	if (days < 30)
		return `${days} day${days > 1 && "s" || ""} ago`;

	let month = date.getMonth() + 1;
	let day = date.getDate() + 1;
	let year =  date.getYear() - 100;
	let dayString = (day < 10 && "0" + day) || day.toString();
	let monthString = (month < 10 && "0" + month) || month.toString();
	return `${monthString}-${dayString}-20${year}`
}

