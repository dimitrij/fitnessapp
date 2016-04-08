import React from 'react';
import Request from '../../node_modules/superagent/lib/client';
import d3 from '../../node_modules/d3/d3.min';
import Calories from './Calories';
import {cursors, userCalories} from '../services/UserCalories';

var dataTotalCals = 0,
	dataCurrentConsumed = 0,
	dataCaloriesBurned = 0,
	dataExcessConsumed = 0,
	caloriesRemaining = 0;

class Dial extends React.Component{

	constructor(){
		super();
		this.rerenderDailyPermitted = this.rerenderDailyPermitted.bind(this);
		this.updateDailyPermitted = this.updateDailyPermitted.bind(this);
		this.width = 420;
		this.height = 400;
		this.date = new Date();
		this.month = this.date.getMonth() + 1 < 10 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1;
		this.today = String(this.parseDate(this.date.getFullYear() + '' + this.month + '' + this.date.getDate())).substr(4, 11);
		this.circ = 2 * Math.PI;
		this.centreX = this.width / 2;
		this.centreY = this.height / 2;
		this.state = {
			dataTotalCals : 0,
			dataCurrentConsumed : 0,
			dataCaloriesBurned : 0,
			dataExcessConsumed : 0,
			caloriesRemaining : 0
		};



		Request
			.get('/users/user')
			.end((err, res)=> {
				if (res.ok){
					this.calsObj = res.body;
					//this.setState({
						dataTotalCals = parseInt(this.calsObj[0]['totalCalories']);
						//dataCurrentConsumed = parseInt(this.calsObj[0]['currentConsumed']);
						dataCaloriesBurned = parseInt(this.calsObj[0]['caloriesBurned']);
						dataExcessConsumed = parseInt(this.calsObj[0]['excessConsumed']);
					//});

				} else{
					console.log('error');
				}
			});
	}

	parseDate(date){
		return d3.time.format('%Y%m%d').parse(date);
	}

	componentDidMount(){
		this.svg = d3.select('#calories').append('svg')
			.attr('width', this.width)
			.attr('height', this.height)
			.append('g').attr('id', 'dial-container')
			.attr('transform', 'translate(' + (this.centreX + 80) + ',' + this.centreY + ')');

		cursors.consumedCalories.on('update', () => {
			if(document.querySelector('#dial-container')){
				document.querySelector('#dial-container').innerHTML = '';
			}
			var objConsumed = userCalories.getCalories()

			//console.log('xxxx', objConsumed.calories.consumed, dataTotalCals)

			this.setState({
				dataCurrentConsumed : objConsumed.calories.consumed,
				dataTotalCals : dataTotalCals,
				dataCaloriesBurned : dataCaloriesBurned,
				dataExcessConsumed : objConsumed.calories.consumed - dataTotalCals
				 /*dataCaloriesBurned : dataCaloriesBurned,
				 dataExcessConsumed : dataExcessConsumed*/
			});
			//console.log(this.state.dataCurrentConsumed, this.state.dataTotalCals)
		})
	}

	rerenderDailyPermitted(e){
		if(document.querySelector('#dial-container')){
			document.querySelector('#dial-container').innerHTML = '';
		}
		this.setState({
			dataTotalCals : e.target.value //will need to add debounce
		});
	}

	updateDailyPermitted(e){
		Request
			.put('/users/updatecalories')
			.set('Accept', 'application/json')
			.send({'totalCalories' : React.findDOMNode(this.refs.dailyPermitted).value})
			.end((err, res)=> {
				if (res.ok){
					//this.calsObj = res.body;
					//console.log(React.findDOMNode(this.refs.dailyPermitted).value);

				} else{
					console.log('error');
				}
			});
	}

	render(){
		//console.log(this.state.dataCurrentConsumed > this.state.dataTotalCals, this.state.dataCurrentConsumed, this.state.dataTotalCals)
		/*if (this.state.dataCurrentConsumed > this.state.dataTotalCals){
			console.log('inside if')
			var exceededCals = <Calories data={{id : 'excess-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataExcessConsumed, innerRadius : 90, outerRadius : 115, bgColour: 'transparent', fgColour : '#CE392B', circ : this.circ}} />;
		}*/

		//if(this.state.dataCurrentConsumed > this.state.dataTotalCals){
			console.log('dataCurrentConsumed', this.state.dataCurrentConsumed)
			console.log('dataTotalCals', this.state.dataTotalCals)
			console.log('dataCaloriesBurned', this.state.dataCaloriesBurned)
			console.log('dataExcessConsumed', this.state.dataExcessConsumed)
			console.log(this.state.dataCurrentConsumed > this.state.dataTotalCals)
			//console.log('greater')
		//}

		return (
			<div id="calories">
				<h1>Today's calories</h1>
				<Legend dataCurrentConsumed={this.state.dataCurrentConsumed} dataCaloriesBurned={this.state.dataCaloriesBurned} dataExcessConsumed={this.state.dataExcessConsumed} />
				<div className="user-stats"></div>
				{/*<Calories data={{id : 'calories-burned', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCaloriesBurned, innerRadius : 65, outerRadius : 95, bgColour: '#e9e9e9', fgColour : '#7FBB5B', circ : this.circ}} />*/}
				<Calories data={{id : 'current-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCurrentConsumed, innerRadius : 90, outerRadius : 115, bgColour: '#e9e9e9', fgColour : '#25B3F9', circ : this.circ}} />

				{console.log('in render', this.state.dataCurrentConsumed,  this.state.dataTotalCals)}
				<Calories data={{id : 'excess-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataExcessConsumed, innerRadius : 65, outerRadius : 90, bgColour: '#e9e9e9', fgColour : '#CE392B', circ : this.circ}}/>


				{/*<Calories data={{id : 'centre', dataTotalCals :0, consumed : 0, innerRadius : 0, outerRadius : 65, bgColour: '#f7f7f7', fgColour : '#f7f7f7', circ : this.circ}} />*/}
				<text id="daily-permitted-text">Daily calorie intake</text>
				<input type="text" ref="dailyPermitted" id="daily-permitted" onBlur={this.updateDailyPermitted} onChange={this.rerenderDailyPermitted} value={this.state.dataTotalCals} />
			</div>
		);
	}
}

class Legend extends React.Component{
	render(){
		return(
			<ul id="legend">
				<li><div className="legend blue"></div>Caloried consumed <span className="amount">{this.props.dataCurrentConsumed}</span></li>
				<li><div className="legend green"></div>Caloried burned <span className="amount">{this.props.dataCaloriesBurned}</span></li>
				<li><div className="legend red"></div>Excess calories <span className="amount">{this.props.dataExcessConsumed <= 0 ? 0 : this.props.dataExcessConsumed}</span></li>
				{this.props.dataExcessConsumed <= 0 &&
					<li><p>You have {-this.props.dataExcessConsumed} calories remaining</p></li>
				}
			</ul>
		)
	}
}

export default Dial;