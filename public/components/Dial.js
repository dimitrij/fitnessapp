import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from '../../node_modules/d3/d3.min';
import Calories from './Calories';
import Legend from './Legend';
//import {cursors, userCalories} from '../services/UserCalories';
import ApiService from '../services/ApiService';
import { connect, Provider } from 'react-redux'
/*import { createStore } from 'redux'
import fitnessApp from '../js/reducers'
import { updateCalories } from '../js/actions'
let store = createStore(fitnessApp)*/

// add comments
// error handling
// tests

//these shouldnt be here
var dataTotalCals = 0,
	dataCurrentConsumed = 0,
	dataCaloriesBurned = 0,
	dataExcessConsumed = 0,
	apiService = new ApiService();

//add prop validation

class Dial extends Component {

	constructor(props){
		super(props);
		this.rerenderDailyPermitted = this.rerenderDailyPermitted.bind(this);
		this.width = 420;
		this.height = 240;
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
	}

	componentDidMount(){
		
		apiService.getUser().end((err, res)=> {
			this.setUser(err, res);
		});
		
		this.svg = d3.select('#calories').append('svg')
			.attr('width', this.width)
			.attr('height', this.height)
			.append('g').attr('id', 'dial-container')
			.attr('transform', 'translate(' + (this.centreX) + ',' + 110 + ')');

		/*cursors.consumedCalories.on('update', () => {
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
		})*/
		
		
		// get data from redux store
		// set state with retrieved data
	}
	
	setUser(err, res){
		if (res.ok){
			this.calsObj = res.body;
			dataTotalCals = parseInt(this.calsObj[0]['totalCalories']);
			//dataCurrentConsumed = parseInt(this.calsObj[0]['currentConsumed']);
			dataCaloriesBurned = parseInt(this.calsObj[0]['caloriesBurned']);
			dataExcessConsumed = parseInt(this.calsObj[0]['excessConsumed']);
			ReactDOM.findDOMNode(this.refs.dailyPermitted).value = dataTotalCals;
		} else{
			console.log(err);
		}
	}
	
	parseDate(date){
		return d3.time.format('%Y%m%d').parse(date);
	}

	rerenderDailyPermitted(e){
		if(document.querySelector('#dial-container')){
			document.querySelector('#dial-container').innerHTML = '';
		}

		var newDailyPermitted = ReactDOM.findDOMNode(this.refs.dailyPermitted).value;

		apiService.updateCalories({'totalCalories' : newDailyPermitted}).end((err, res)=>{
			this.updateCaloriesCallback(err, res, newDailyPermitted);
		})
	}

	updateCaloriesCallback(err, res, newDailyPermitted){
		if (res.ok){
			/*var objConsumed = userCalories.getCalories();
			this.setState({
				dataTotalCals : newDailyPermitted,
				dataExcessConsumed : objConsumed.calories.consumed - newDailyPermitted
			});*/
		} else{
			console.log(err);
		}
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
		console.log('this.props - render', this.props)
		return (
			<div id="calories">
				<h1>Today's calories</h1>
				{/*<Calories data={{id : 'calories-burned', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCaloriesBurned, innerRadius : 65, outerRadius : 95, bgColour: '#e9e9e9', fgColour : '#7FBB5B', circ : this.circ}} />*/}
				<Calories data={{id : 'current-consumed', dataTotalCals :this.props.dataTotalCals, consumed : this.props.dataCurrentConsumed, innerRadius : 90, outerRadius : 105, bgColour: '#7CBDD7', fgColour : '#ffffff', circ : this.circ}} />
				<Calories data={{id : 'excess-consumed', dataTotalCals :this.props.dataTotalCals, consumed : this.props.dataExcessConsumed, innerRadius : 75, outerRadius : 90, bgColour: '#7CBDD7', fgColour : '#CE392B', circ : this.circ}}/>
				<text id="daily-permitted-text">Daily calorie intake</text>
				<input type="text" ref="dailyPermitted" id="daily-permitted"
					   onChange={this.debounce(this.rerenderDailyPermitted, 800)}
					   defaultValue="" />
				<Legend dataCurrentConsumed={this.props.dataCurrentConsumed}
						dataCaloriesBurned={this.props.dataCaloriesBurned}
						dataExcessConsumed={this.props.dataExcessConsumed} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	console.log('mapStateToProps', dataTotalCals)
	return {
		dataTotalCals: 2250,
		dataCurrentConsumed: state.calories,
		dataExcessConsumed: 0
	}
}

export default connect(mapStateToProps)(Dial)