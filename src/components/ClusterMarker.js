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
	onMarkerClick = () => {
		const { onClusterClick, ...cluster } = this.props;
		onClusterClick(cluster);
	};

	render() {
		const { longitude, latitude, pointCount } = this.props;

		return (
			<Marker longitude={longitude} latitude={latitude}>
				<div
					onClick={this.onMarkerClick}
					style={{ ...style, background: '#f28a25' }}
				>
					{pointCount}
				</div>
			</Marker>
		);
	}
}

export default ClusterMarker;
