import React, { Component } from 'react';
import Jer from '../assets/jer.png';
import Arch from '../assets/arch.png';

export default class About extends Component {
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
							I like keyboard-driven applications, like <a href="https://www.vim.org">Vim</a>, <a href="https://www.qutebrowser.org">Qutebrowser</a> and <a href="https://dwm.suckless.org/">DWM</a>.
					</p>
					<br />
				</div>
				<div className="this-site">
					<h1>About This Site</h1>
					<p className="first"> 
							This site is written with <a href="https://reactjs.org/">React</a>, served with the help of <a href="https://rocket.rs/">Rocket</a>, a web framework written in <a href="https://www.rust-lang.org">Rust</a>. This site is actively developed, maintained and deployed on <a href="https://www.archlinux.org/">Arch Linux</a>.
					</p>
					<img src={Arch} className="arch"/>
				</div>
			</div>
		);
	}
}
