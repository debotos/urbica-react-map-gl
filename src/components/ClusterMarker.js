import React from 'react';
import { Marker } from '@urbica/react-map-gl';

export const style = {
	width: '20px',
	height: '20px',
	color: '#fff',
	background: 'red',
	borderRadius: '20px',
	textAlign: 'center'
};

class ClusterMarker extends React.PureComponent {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		const { onClick, ...cluster } = this.props;
		onClick(cluster);
	}

	render() {
		const { longitude, latitude, pointCount } = this.props;

		return (
			<Marker longitude={longitude} latitude={latitude}>
				<div onClick={this.onClick} style={{ ...style, background: '#f28a25' }}>
					{pointCount}
				</div>
			</Marker>
		);
	}
}

export default ClusterMarker;
