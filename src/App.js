import React from 'react';
import $ from 'jquery';
import MapGL, { Marker, Popup } from '@urbica/react-map-gl';
import Cluster from '@urbica/react-map-gl-cluster';
import 'mapbox-gl/dist/mapbox-gl.css';

import ClusterMarker from './components/ClusterMarker';
import { LoadingImage } from './components/loader';
import JobPin from './components/job-pin';
import Navigation from './components/Navigation';
import JobInfo from './components/job-info';
import Intercom from './components/Intercom';
import Logo from './assets/Heirizon-Logo.png';
import './app.css';

import MOCK_DATA from './db.json';
import keys from './config/keys';

const { TOKEN, ZOOM, pinColor } = keys;

const testData = {
	latitude: 41.891429,
	longitude: -87.627369,
	multiple: true,
	jobs: [
		{
			title: 'Marketing Internship for a HealthTech Start-up',
			type: 'Permanent',
			description:
				'We are looking for a marketing intern to support the CancerIQ inbound marketing activities. The internship will be ideal for someone who is interested in a holistic view of the marketing function, including marketing automation, email marketing, social media marketing, content development, event marketing, etc.',
			contact: 'https://canceriq.workable.com/j/08D96C8ED9',
			industry: 'Finance & Accounting'
		},
		{
			title: 'Account Executive',
			type: 'Permanent',
			description:
				'We are seeking Account Executives with a passion for novel technology in big markets. We are targeting mid-market organizations and large enterprises in all verticals, and especially Financial Services and Healthcare, with a focus on their governance, risk, and compliance (GRC) activities. We are disrupting the GRC and BPM software industries by providing a solution end users can self-manage, saving enterprises huge amounts of time and money. ',
			contact: 'https://logicgate.workable.com/j/E055F449E4',
			industry: 'Finance & Accounting'
		}
	]
};
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			viewport: {
				latitude: 0,
				longitude: 0,
				zoom: ZOOM
			},
			loading: true,
			working: true,
			DATA: null,
			gotUserLocation: false,
			userLocation: null,
			search: '',
			popupInfo: null,
			multipleMarkerObject: null
		};

		this._cluster = React.createRef();
		this.onViewportChange = this.onViewportChange.bind(this);
	}

	componentDidMount() {
		this._locateUser();
		this._loadJobsData();
	}

	handleSubmit = event => {
		event.preventDefault();
		this.setState({ multipleMarkerObject: null, popupInfo: null });
		const search = this.state.search.trim();
		if (!search) return;
		console.log('Searching for ', search);
		this.setState({ working: true });

		// this is for local testing
		// later this logic will in server side
		let newData = MOCK_DATA.map((singleItem, i) => {
			let result;
			result = singleItem.jobs.filter(
				job =>
					job['title'].toLowerCase().includes(search.toLowerCase()) ||
					job['description'].toLowerCase().includes(search.toLowerCase()) ||
					job['type'].toLowerCase().includes(search.toLowerCase())
			);
			if (result.length > 0) {
				return { ...singleItem, jobs: result };
			} else {
				return null;
			}
		});

		console.log(newData);

		setTimeout(() => this.setState({ working: false, DATA: newData }), 2000);
	};

	_loadJobsData = () => {
		// for testing
		setTimeout(() => {
			this.setState({ DATA: MOCK_DATA, working: false });
		}, 1000);
	};

	onViewportChange(viewport) {
		this.setState({ viewport });
	}

	onClusterClick = cluster => {
		const { clusterId, longitude, latitude } = cluster;
		const supercluster = this._cluster.current.getCluster();
		const zoom = supercluster.getClusterExpansionZoom(clusterId);

		this.setState(state => {
			const newVewport = {
				...state.viewport,
				latitude,
				longitude,
				zoom
			};

			return { ...state, viewport: newVewport };
		});
	};

	render() {
		let {
			viewport,
			loading,
			working,
			DATA,
			gotUserLocation,
			search,
			multipleMarkerObject,
			popupInfo
		} = this.state;

		if (loading) return <GettingLocation />;
		if (working) return <GettingData />;

		return (
			<MapGL
				style={{ width: '100%', height: '100vh' }}
				mapStyle="mapbox://styles/heirizon/cjrxtipz117fb1fpc2bh47qsk"
				accessToken={TOKEN}
				onViewportChange={this.onViewportChange}
				{...viewport}
			>
				<Cluster
					ref={this._cluster}
					radius={40}
					extent={512}
					nodeSize={64}
					component={cluster => {
						return (
							<ClusterMarker
								onClusterClick={this.onClusterClick}
								{...cluster}
							/>
						);
					}}
				>
					{/* problem in this function */}
					{DATA && DATA.map(this._renderJobMarker)}
					{/* <Marker longitude={-87.627369} latitude={41.891429}>
						<span className="pulse-button" />
					</Marker> */}
				</Cluster>
				{gotUserLocation && this._renderUserLocation()}
				{multipleMarkerObject && this._renderMultipleMarker()}
				{popupInfo && this._renderPopup()}
			</MapGL>
		);
	}

	_locateUser = () => {
		// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
		var options = {
			enableHighAccuracy: true,
			// timeout: 5000,
			maximumAge: 0
		};

		const success = position => {
			const { longitude, latitude } = position.coords;
			const viewport = { longitude, latitude, zoom: ZOOM };
			console.log(viewport);
			this.setState({ viewport }, () => {
				setTimeout(
					() =>
						this.setState({
							loading: false,
							gotUserLocation: true,
							userLocation: viewport
						}),
					2000
				);
			});
		};

		const error = err => {
			this.setState({ loading: false });
			alert(`ERROR(${err.code}): ${err.message}`);
			console.warn(`ERROR(${err.code}): ${err.message}`);
		};

		navigator.geolocation.getCurrentPosition(success, error, options);
	};

	_renderUserLocation = () => {
		const { longitude, latitude } = this.state.userLocation;

		return (
			<Marker longitude={longitude} latitude={latitude}>
				<span className="pulse-button" />
			</Marker>
		);
	};

	_renderPopup = () => {
		const { popupInfo } = this.state;
		const { multiple } = popupInfo || {};
		// console.log(popupInfo);
		return (
			popupInfo && (
				<Popup
					longitude={popupInfo.longitude}
					latitude={popupInfo.latitude}
					closeOnClick={false}
					anchor="bottom"
					offsetLeft={14}
					offsetTop={multiple ? -14 : 1}
					tipSize={10}
					onClose={() => this.setState({ popupInfo: null })}
				>
					<JobInfo info={popupInfo} />
				</Popup>
			)
		);
	};

	_renderMultipleMarker = () => {
		const { multipleMarkerObject } = this.state;

		return (
			multipleMarkerObject && (
				<Marker
					longitude={multipleMarkerObject.longitude}
					latitude={multipleMarkerObject.latitude}
				>
					<div>
						<ul className="circle-container">
							<li style={{ marginLeft: -16, marginTop: -14 }}>
								{/* circle */}
								<div
									onClick={() => {
										this.setState({
											multipleMarkerObject: null,
											popupInfo: null
										});
									}}
									style={styles.multiMarkerCenter}
								>
									<span style={styles.jobAmountCenter}>
										{multipleMarkerObject.jobs.length}
									</span>
								</div>
							</li>
							{multipleMarkerObject.jobs.map((singleItem, index) => {
								let data = {
									multiple: true,
									jobs: [{ ...singleItem }],
									latitude: multipleMarkerObject.latitude,
									longitude: multipleMarkerObject.longitude
								};
								return (
									<li className="multipleMarkerPin" key={index}>
										<JobPin
											key={index}
											onClick={() => this.setState({ popupInfo: data })}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				</Marker>
			)
		);
	};

	handleMultipleJobUI = singleItem => {
		this.setState({ multipleMarkerObject: null }, () => {
			// 'null' just for DOM reinitialize
			setTimeout(() => {
				this.setState({ multipleMarkerObject: singleItem }, () => {
					setTimeout(() => {
						renderMultiMarkerUI();
					}, 10);
				});
			}, 10);
		});
	};

	_renderJobMarker = (singleItem, index) => {
		if (!singleItem) return [];
		if (singleItem.multiple) {
			// multiple job at a place
			let { multipleMarkerObject } = this.state;
			let output = (
				<Marker
					key={`marker-${index}`}
					longitude={singleItem.longitude}
					latitude={singleItem.latitude}
				>
					<div style={styles.multiJobMarker}>
						<p style={styles.jobAmount}>{singleItem.jobs.length}</p>
						<JobPin onClick={() => this.handleMultipleJobUI(singleItem)} />
					</div>
				</Marker>
			);
			if (!multipleMarkerObject) {
				// null case
				return output;
			} else {
				if (
					// when the multiple marker is not selected
					multipleMarkerObject.latitude !== singleItem.latitude &&
					multipleMarkerObject.longitude !== singleItem.longitude
				) {
					return output;
				} else {
					return [];
				}
			}
		} else {
			return (
				// This for single job at a place
				// purpose of this, when i click on a multiple job marker it will be 'null' means
				// it will vanish and at that place show the new Marker will all jobs pin
				<Marker
					key={`marker-${index}`}
					longitude={singleItem.longitude}
					latitude={singleItem.latitude}
				>
					<JobPin onClick={() => this.setState({ popupInfo: singleItem })} />
				</Marker>
			);
		}
	};
}

export default App;

const styles = {
	multiJobMarker: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	jobAmount: {
		color: pinColor,
		fontWeight: 'bold',
		margin: 0,
		fontSize: 25
	},
	multiMarkerCenter: {
		backgroundColor: pinColor,
		borderRadius: '50%',
		height: 64,
		width: 64,
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex'
	},
	jobAmountCenter: {
		position: 'relative',
		zIndex: 99,
		color: '#fff',
		fontSize: 35,
		fontWeight: 'bold',
		margin: 10
	},
	// loading
	loadingContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
		width: '100vw',
		backgroundColor: '#07194f'
	},
	loadingContent: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
};

// this function is depend on jQuery
const renderMultiMarkerUI = () => {
	var type = 1, //circle type - 1 whole, 0.5 half, 0.25 quarter
		radius = '4em', //distance from center
		start = -90, //shift start from 0
		$elements = $('li.multipleMarkerPin:not(:first-child)'),
		numberOfElements = type === 1 ? $elements.length : $elements.length - 1, //adj for even distro of elements when not full circle
		slice = (360 * type) / numberOfElements;

	$elements.each(function(i) {
		var $self = $(this),
			rotate = slice * i + start,
			rotateReverse = rotate * -1;

		$self.css({
			transform:
				'rotate(' +
				rotate +
				'deg) translate(' +
				radius +
				') rotate(' +
				rotateReverse +
				'deg)'
		});
	});
};

const GettingLocation = () => (
	<div style={styles.loadingContainer}>
		<div style={styles.loadingContent}>
			<div>
				<LoadingImage />
			</div>
			<div style={{ marginTop: 10 }}>
				<h4 style={{ color: '#fff' }}>Getting Your Location...</h4>
			</div>
		</div>
	</div>
);

const GettingData = () => (
	<div style={styles.loadingContainer}>
		<div style={styles.loadingContent}>
			<div>
				<LoadingImage />
			</div>
			<div style={{ marginTop: 10 }}>
				<h4 style={{ color: '#fff' }}>Getting Jobs List...</h4>
			</div>
		</div>
	</div>
);
