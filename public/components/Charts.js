import React from 'react';
import Tracker from './Tracker';
import Dial from './Dial';

class Charts extends React.Component{

	render(){
		return (
			<div id="chart" className="clearfix">
				<Dial/>
				<Tracker/>
			</div>
		);
	}
}

export default Charts;