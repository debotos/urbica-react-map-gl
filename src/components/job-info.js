import React, { PureComponent } from 'react';

export default class JobInfo extends PureComponent {
	render() {
		const { info } = this.props;
		const { jobs } = info;
		// jobs is an array[{}] that will always contain one job obj can be accessed via [0]
		const job = jobs[0];

		return (
			<div
				style={{ fontWeight: 'bold', fontFamily: 'Fira Sans', color: '#fff' }}
			>
				<p style={{ margin: 0 }}>
					Job Title: <span style={{ fontWeight: 'lighter' }}>{job.title}</span>
				</p>
				{job.industry && (
					<p style={{ margin: 0 }}>
						Industry:{' '}
						<span style={{ fontWeight: 'lighter' }}>{job.industry}</span>
					</p>
				)}
				<p style={{ margin: 0 }}>
					Job Type: <span style={{ fontWeight: 'lighter' }}>{job.type}</span>
				</p>
				<p style={{ margin: 0 }}>
					Description:{' '}
					<span style={{ fontWeight: 'lighter' }}>{job.description}</span>
				</p>
				<p style={{ textAlign: 'center', margin: 0 }}>
					<a
						style={{ textDecoration: 'none' }}
						rel="nofollow noopener noreferrer"
						target="_blank"
						href={job.contact}
						className="more-info"
					>
						<span style={{ color: 'deepskyblue' }}>More</span>
					</a>
				</p>
			</div>
		);
	}
}
