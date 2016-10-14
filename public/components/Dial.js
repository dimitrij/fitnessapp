import React, { Component, PropTypes } from 'react';
import d3 from '../../node_modules/d3/d3.min';
import $ from '../js/utils';
import Calories from './Calories';
import Legend from './Legend';
import ApiService from '../services/ApiService';
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { getTotalCalories } from '../js/actions';
import { updateCurrentConsumed } from '../js/actions';

// add comments
// error handling
// tests
//add prop validation

class Dial extends Component {

	constructor(props){
		super(props);
		this.rerenderDailyPermitted = this.rerenderDailyPermitted.bind(this);
		this.width = 420;
		this.height = 240;
		this.date = new Date();
		this.month = this.date.getMonth() + 1 < 10 ? '0' + (this.date.getMonth() + 1) : this.date.getMonth() + 1;
		this.centreX = this.width / 2;
		this.dataTotalCals = 0;
		this.apiService = new ApiService();
	}

	componentDidMount(){
		this.apiService.getUser().end((err, res)=> {
			if (res.ok){
				this.setUser(res);
			} else {
				console.log(err);
			}
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
		})*/
	}
	
	setUser(res){
		this.calsObj = res.body;
		this.dataTotalCals = parseInt(this.calsObj[0]['totalCalories']);
		this.props.actions.getTotalCalories(this.dataTotalCals);
		this.props.actions.updateCurrentConsumed(this.props.dataCurrentConsumed - this.dataTotalCals);
		this.refs.dailyPermitted.value = this.dataTotalCals;
	}
	
	parseDate(date){
		return d3.time.format('%Y%m%d').parse(date);
	}

	rerenderDailyPermitted(e){
		if(document.querySelector('#dial-container')){
			document.querySelector('#dial-container').innerHTML = '';
		}

		let newDailyPermitted = this.refs.dailyPermitted.value;
		
		this.apiService.updateCalories({'totalCalories' : newDailyPermitted}).end((err, res)=>{
			this.updateCalories(err, res, newDailyPermitted);
		})
	}

	updateCalories(err, res, newDailyPermitted){
		if (res.ok){
			this.props.actions.getTotalCalories(newDailyPermitted);
			this.props.actions.updateCurrentConsumed(this.props.dataCurrentConsumed - newDailyPermitted);
		} else{
			console.log(err);
		}
	}

	render(){
		console.log('this.props - render', this.props.dataCurrentConsumed, this.props.dataExcessConsumed)
		return (
			<div id="calories">
				<h1>Today's calories</h1>
				{/*<Calories data={{id : 'calories-burned', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCaloriesBurned, innerRadius : 65, outerRadius : 95, bgColour: '#e9e9e9', fgColour : '#7FBB5B'}} />*/}
				<Calories data={{id : 'current-consumed', dataTotalCals :this.props.dataTotalCals, consumed : this.props.dataCurrentConsumed, innerRadius : 90, outerRadius : 105, bgColour: '#7CBDD7', fgColour : '#ffffff'}} />
				<Calories data={{id : 'excess-consumed', dataTotalCals :this.props.dataTotalCals, consumed : this.props.dataExcessConsumed, innerRadius : 75, outerRadius : 90, bgColour: '#7CBDD7', fgColour : '#CE392B'}}/>
				<text id="daily-permitted-text">Daily calorie intake</text>
				<input type="text" ref="dailyPermitted" id="daily-permitted"
					   onChange={$.debounce(this.rerenderDailyPermitted, 800)}
					   defaultValue="" />
				<Legend dataCurrentConsumed={this.props.dataCurrentConsumed}
						dataCaloriesBurned={this.props.dataCaloriesBurned}
						dataExcessConsumed={this.props.dataExcessConsumed} />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ getTotalCalories, updateCurrentConsumed }, dispatch) });

const mapStateToProps = state => {
	console.log('typeof', state, state.totalCalories)
	return {
		dataTotalCals: state.totalCalories,// from database
		dataCurrentConsumed: state.calories, //from MealTotals component
		dataExcessConsumed: state.currentConsumed,// from Dial component
		dataCaloriesBurned: 0
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Dial);