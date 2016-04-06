import React from 'react';
import Request from '../../node_modules/superagent/lib/client';
import d3 from '../../node_modules/d3/d3.min';
import Calories from './Calories';

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
			dataTotalCals : null,
			dataCurrentConsumed : null,
			dataCaloriesBurned : null,
			dataExcessConsumed : null,
			caloriesRemaining : null
		};

		Request
			.get('/users/user')
			.end((err, res)=> {
				if (res.ok){
					this.calsObj = res.body;
					this.setState({
						dataTotalCals : parseInt(this.calsObj[0]['totalCalories']),
						dataCurrentConsumed : parseInt(this.calsObj[0]['currentConsumed']),
						dataCaloriesBurned : parseInt(this.calsObj[0]['caloriesBurned']),
						dataExcessConsumed : parseInt(this.calsObj[0]['excessConsumed'])
					});

					/*this.setState({
						caloriesRemaining : (this.state.dataTotalCals + this.state.dataCaloriesBurned) - (this.state.dataCurrentConsumed + this.state.dataExcessConsumed)
					});*/

					this.appendCaloriesText();

				} else{
					console.log('error');
				}
			});
	}

	parseDate(date){
		return d3.time.format('%Y%m%d').parse(date);
	}

	appendCaloriesText(){
		/*this.svg.append('input').attr('id', 'daily-permitted').attr('transform', 'translate(-10000,0)').text(this.state.dataTotalCals)
			.on('mouseover', function () {
				var offsetWidth = document.getElementById('daily-permitted-text').getBBox().width;
				d3.select('#daily-permitted-text').attr('transform', 'translate(' + (-offsetWidth/2) + ',-45)');
				d3.select('#daily-permitted-text').classed('visible', true);
			})
			.on('mouseout', function(){
				d3.select('#daily-permitted-text').classed('visible', false);
			})
			.on('focus', function(){
				console.log('sdfsdfsdfsd');
			});
		this.dailyPermittedOffset = document.getElementById('daily-permitted').getBBox();
		d3.select('#daily-permitted').attr('transform', 'translate(' + -(this.dailyPermittedOffset.width / 2) + ',0)');*/

		/*this.svg.append('text').attr('id', 'calories-remaining').attr('transform', 'translate(-10000,150)').text(this.state.caloriesRemaining)
			.on('mouseover', function () {
				var offsetWidth = document.getElementById('calories-remaining-text').getBBox().width;
				d3.select('#calories-remaining-text').attr('transform', 'translate(' + (-offsetWidth/2) + ',55)');
				d3.select('#calories-remaining-text').classed('visible', true);
			})
			.on('mouseout', function(){
				d3.select('#calories-remaining-text').classed('visible', false);
			});
		this.dailyCaloriesRemaining = document.getElementById('calories-remaining').getBBox();
		d3.select('#calories-remaining').attr('transform', 'translate(' + -(this.dailyCaloriesRemaining.width / 2) + ',35)');*/

		this.svg.append('text').attr('id', 'daily-permitted-text').attr('transform', 'translate(-10000,-45)').text('Daily calorie intake');
		this.svg.append('text').attr('id', 'calories-remaining-text').attr('transform', 'translate(-10000,60)').text('Remaining calories today');
		this.svg.append('text').attr('id', 'today').attr('class', 'info').attr('transform', 'translate(-10000,-135)').text(this.today);
		this.svg.append('text').attr('id', 'current-consumed').attr('class', 'info').attr('transform', 'translate(-10000,-120)').text('Calories consumed: ' + this.state.dataCurrentConsumed);
		this.svg.append('text').attr('id', 'calories-burned').attr('class', 'info').attr('transform', 'translate(-10000,-120)').text('Calories burned: ' + this.state.dataCaloriesBurned);
		this.svg.append('text').attr('id', 'excess-consumed').attr('class', 'info').attr('transform', 'translate(-10000,-120)').text('Excess calories: ' + this.state.dataExcessConsumed);
	}

	componentDidMount(){
		this.svg = d3.select('#calories').append('svg')
			.attr('width', this.width)
			.attr('height', this.height)
			.append('g')
			.attr('transform', 'translate(' + (this.centreX + 80) + ',' + this.centreY + ')');
	}

	rerenderDailyPermitted(e){
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
					console.log(React.findDOMNode(this.refs.dailyPermitted).value);

				} else{
					console.log('error');
				}
			});
	}

	render(){

		if (this.state.dataCurrentConsumed > this.state.dataTotalCals){
			var exceededCals = <Calories data={{id : 'excess-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataExcessConsumed, innerRadius : 90, outerRadius : 115, bgColour: 'transparent', fgColour : '#CE392B', circ : this.circ}} />;
		}

		return (
			<div id="calories">
				<h1>Today's calories</h1>
				<Legend dataCurrentConsumed={this.state.dataCurrentConsumed} dataCaloriesBurned={this.state.dataCaloriesBurned} dataExcessConsumed={this.state.dataExcessConsumed} />
				<div className="user-stats"></div>
				<Calories data={{id : 'calories-burned', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCaloriesBurned, innerRadius : 65, outerRadius : 95, bgColour: '#e9e9e9', fgColour : '#7FBB5B', circ : this.circ}} />
				<Calories data={{id : 'current-consumed', dataTotalCals :this.state.dataTotalCals, consumed : this.state.dataCurrentConsumed, innerRadius : 90, outerRadius : 115, bgColour: '#e9e9e9', fgColour : '#25B3F9', circ : this.circ}} />
				{exceededCals}
				<Calories data={{id : 'centre', dataTotalCals :0, consumed : 0, innerRadius : 0, outerRadius : 65, bgColour: '#f7f7f7', fgColour : '#f7f7f7', circ : this.circ}} />
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
				<li><div className="legend red"></div>Excess calories <span className="amount">{this.props.dataExcessConsumed}</span></li>
			</ul>
		)
	}
}

export default Dial;