import React from 'react';
import Tracker from './Tracker';
import Dial from './Dial';

class Chart extends React.Component {

	render(){
		return (
			<div id="chart" className="clearfix">
				<Tracker/>
				<Dial/>
			</div>
		)
	}
}

export default Chart;