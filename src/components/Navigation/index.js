import React, { Component } from 'react';

import './navigation.css';
import LightLogo from '../../assets/Heirizon-Light-Logo.png';

export default class Navigation extends Component {
	render() {
		return (
			<div className="navigation">
				<input
					type="checkbox"
					className="navigation__checkbox"
					id="navi-toggle"
				/>
				<label htmlFor="navi-toggle" className="navigation__button">
					<span className="navigation__icon">&nbsp;</span>
				</label>
				<div className="navigation__background">&nbsp;</div>

				<nav className="navigation__nav">
					<div className="navigation__logo">
						<img
							style={{ height: '2rem', width: '206px' }}
							src={LightLogo}
							alt="logo"
						/>
					</div>
					<ul className="navigation__list">
						<li className="navigation__item">
							<a href="https://www.heirizon.com/" className="navigation__link">
								Home
							</a>
						</li>
						<li className="navigation__item">
							<a
								href="https://corporate.heirizon.com/about/"
								className="navigation__link"
							>
								About
							</a>
						</li>
						<li className="navigation__item">
							<a
								href="https://corporate.heirizon.com/partners/"
								className="navigation__link"
							>
								Partners
							</a>
						</li>
						<li className="navigation__item">
							<a
								href="https://corporate.heirizon.com/press-and-media/"
								className="navigation__link"
							>
								Press & Media
							</a>
						</li>
						<li className="navigation__item">
							<a
								href="https://corporate.heirizon.com/contact/"
								className="navigation__link"
							>
								Contact
							</a>
						</li>
					</ul>
					<div className="navigation__footer">
						<p>© 2019 Heirizon, Inc. All Rights Reserved.</p>
					</div>
				</nav>
			</div>
		);
	}
}
