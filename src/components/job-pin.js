import React, { PureComponent } from 'react';

import Marker from '../assets/marker.svg';

export default class JobPin extends PureComponent {
	render() {
		const { onClick } = this.props;

		return (
			<img
				style={{ cursor: 'pointer' }}
				src={Marker}
				onClick={onClick}
				alt=""
			/>
		);
	}
}
