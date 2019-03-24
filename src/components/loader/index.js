import React from 'react';

import LoadingGif from '../../assets/Heirizon-Loading.gif';
import './loader.css';

export default () => (
	<div className="lds-roller">
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
		<div />
	</div>
);

export const LoadingImage = () => (
	<img alt="Herizon loading..." style={{ height: '70px' }} src={LoadingGif} />
);
