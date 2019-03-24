import React from 'react';
import Intercom from 'react-intercom';

const APP_ID = '';

export default class IntercomApp extends React.Component {
	render() {
		const { appUser } = this.props;
		let user;
		if (appUser) {
			user = {
				user_id: appUser.id,
				email: appUser.email,
				name: appUser.name
			};
		}

		return (
			<div className="app">
				{appUser ? (
					<Intercom appID={APP_ID} {...user} />
				) : (
					<Intercom appID={APP_ID} />
				)}
			</div>
		);
	}
}
