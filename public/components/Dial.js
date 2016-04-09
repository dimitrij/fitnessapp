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
					React.findDOMNode(this.refs.dailyPermitted).value = dataTotalCals;
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
			var objConsumed = userCalories.getCalories();

			this.setState({
				dataCurrentConsumed : objConsumed.calories.consumed,
				dataTotalCals : dataTotalCals,
				dataCaloriesBurned : dataCaloriesBurned,
				dataExcessConsumed : objConsumed.calories.consumed - dataTotalCals
			});
		})
	}

	rerenderDailyPermitted(e){
		if(document.querySelector('#dial-container')){
			document.querySelector('#dial-container').innerHTML = '';
		}

		var newDailyPermitted = React.findDOMNode(this.refs.dailyPermitted).value;

		Request
			.put('/users/updatecalories')
			.set('Accept', 'application/json')
			.send({'totalCalories' : newDailyPermitted})
			.end((err, res)=> {
				if (res.ok){
					var objConsumed = userCalories.getCalories();
					this.setState({
						dataTotalCals : newDailyPermitted,
						dataExcessConsumed : objConsumed.calories.consumed - newDailyPermitted
					});
				} else{
					console.log('error');
				}
			});
	}

	debounce(fn, delay) {
		var timer = null;
		return function () {
			var args = arguments;
			clearTimeout(timer);
			timer = setTimeout(() => {
				fn(args);
			}, delay);
		};
	}

	render(){
		return (
			<div id="calories">
				<h1>Today's calories</h1>
				<Legend dataCurrentConsumed={this.state.dataCurrentConsumed} dataCaloriesBurned={this.state.dataCaloriesBurned} dataExcessConsumed={this.state.dataExcessConsumed} />
				<div className="user-stats"></div>
				{/*<Calories data={{id : 'calories-burned', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCaloriesBurned, innerRadius : 65, outerRadius : 95, bgColour: '#e9e9e9', fgColour : '#7FBB5B', circ : this.circ}} />*/}
				<Calories data={{id : 'current-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCurrentConsumed, innerRadius : 90, outerRadius : 115, bgColour: '#e9e9e9', fgColour : '#25B3F9', circ : this.circ}} />
				<Calories data={{id : 'excess-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataExcessConsumed, innerRadius : 65, outerRadius : 90, bgColour: '#e9e9e9', fgColour : '#CE392B', circ : this.circ}}/>
				{/*<Calories data={{id : 'centre', dataTotalCals :0, consumed : 0, innerRadius : 0, outerRadius : 65, bgColour: '#f7f7f7', fgColour : '#f7f7f7', circ : this.circ}} />*/}
				<text id="daily-permitted-text">Daily calorie intake</text>
				{console.log('render')}
				<input type="text" ref="dailyPermitted" id="daily-permitted" onChange={this.debounce(this.rerenderDailyPermitted, 800)} defaultValue="" />
			</div>
		);
	}
}

class Legend extends React.Component{

	constructor(){
		super();
		this.state = {
			dataExcessConsumed : 0
		}
	}

	componentWillReceiveProps(nextProps){
		console.log('props received')
	}

	render(){

		console.log('dataExcessConsumed', this.props.dataExcessConsumed)

		return(

			<ul id="legend">
				{console.log('legend')}
				<li><div className="legend blue"></div>Calories consumed <span className="amount">{this.props.dataCurrentConsumed}</span></li>
				<li><div className="legend green"></div>Calories burned <span className="amount">{this.props.dataCaloriesBurned}</span></li>
				<li><div className="legend red"></div>Excess calories <span className="amount">{this.props.dataExcessConsumed <= 0 ? 0 : this.props.dataExcessConsumed}</span></li>
				{this.props.dataExcessConsumed <= 0 &&
					<li><p>You have {-this.props.dataExcessConsumed} calories remaining today</p></li>
				}
				{this.props.dataExcessConsumed > 0 &&
					<li><p>You have exceeded your daily calorie intake by {this.props.dataExcessConsumed} calories</p></li>
				}
			</ul>
		)
	}
}

export default Dial;