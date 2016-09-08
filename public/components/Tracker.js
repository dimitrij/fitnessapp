import React from 'react';
import Request from '../../node_modules/superagent/lib/client';
import d3 from '../../node_modules/d3/d3.min';
import ApiService from '../services/ApiService';

let apiService = new ApiService();

class Tracker extends React.Component {

	constructor() {
		super();
		this.selectUnit = this.selectUnit.bind(this);
		this.selectYear = this.selectYear.bind(this);
		this.margin = {top: 90, bottom: 20, left: 40, right: 40};
		this.w = 520;
		this.h = 164;
		this.areaHeight = 240;
		this.dates = [];
		this.kgs = [];
		this.lbs = [];
		this.selectedUnit = 'kg';
		this.selectedYear = '2014';
		this.getData(true);
	}

	static parseDate(date){
		return d3.time.format("%Y%m%d").parse(date);
	}

	getData(b){
		this.dates = [];
		this.kgs = [];
		this.lbs = [];

		apiService.getUser().end((err, res)=>{
			this.getUserCallback(err, res, b);
		});

	}

	getUserCallback(err, res, b){
		if (res.ok) {
			this.trackerObj = res.body;
			this.name = this.trackerObj[0]['name'];
			this.data = this.trackerObj[0][this.selectedYear];

			this.data.map(datum => {
				if (datum.date.substr(0, 4) === this.selectedYear) {
					this.dates.push(Tracker.parseDate(datum.date));
					this.kgs.push(datum.kg);
					this.lbs.push(datum.lb);
				}
			});

			this.setUnit();
			this.initChart(b);

		} else {
			console.log(err);
		}
	}

	initChart(b){
		this.xScale = d3.time.scale()
			.domain(d3.extent(this.dates))
			.range([0, this.w]);

		this.xAxis = d3.svg.axis()
			.scale(this.xScale)
			.orient('bottom')
			.ticks(12)
			.innerTickSize(6)
			.outerTickSize(0)
			.tickPadding(4)
			.tickFormat((d) => d3.time.format('%b')(new Date(d)));

		this.yScale = d3.scale.linear()
			.domain(d3.extent(this.units))
			.range([this.h, 0]);

		this.yAxis = d3.svg.axis()
			.scale(this.yScale)
			.orient('left');

		if(b){
			this.appendElements();
			this.setChart();
		}

		this.movePlots();
		this.tweenChart();
	}

	setUnit(){
		this.units = this.selectedUnit === 'kg' ? this.kgs : this.lbs;
	}

	appendElements(){
		this.svg = d3.select('#svg')

		this.toggleYAxes();

		this.path = this.svg.append('g')
			.attr('id', 'path')
			.attr('transform', 'translate(40, 10)')
			.append('path')

		this.svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(40, '+ (this.h+86) + ')')
			.call(this.xAxis);

		this.svg.append('g')
			.attr('class', 'y axis currentY')
			.attr('transform', 'translate(40, 70)')
			.call(this.yAxis);

		d3.selectAll('.x .tick text').attr('transform', 'translate(25, 0)');
	}

	yGridLine(){
		return d3.svg.axis()
			.scale(this.yScale)
			.orient("left")
			.ticks(this.data.length)
	}

	setChart(){
		this.area = d3.svg.area()
			//.interpolate('cardinal')
			.x((d, i) => this.xScale(this.dates[i]))
			.y0((d) => this.areaHeight)
			.y1((d, i) => this.areaHeight);

		this.path
			.datum(this.data)
			.attr('d', this.area)
			.attr('stroke', '#25B3F9')
			.attr('stroke-width', 1)
			.attr('fill', 'rgba(204, 204, 204, .6)');

		this.svg.selectAll('circle')
			.data(this.data)
			.enter()
			.append('circle')
			.attr('transform', 'translate(40, 10)')
			.attr('class', 'bubble')
			.attr('cx', (d, i) => this.xScale(this.dates[i]))
			.attr('cy', (d, i) => this.areaHeight)
			.attr('r', (d) => 4)
			.on('mouseover', (d, i) => {
				var circle = d3.select(this.svg[0][0].childNodes[i+5]);
				circle.attr('r', 6);
				circle.classed('active', true);
				this.yScale = d3.scale.linear()
					.domain(d3.extent(this.units))
					.range([this.h, 0]);
				this.toggleToolTip(true, this.xScale(this.dates[i]), (circle.attr('cy')-40), this.dates[i], this.units[i])
			})
			.on('mouseout', (d, i) => {
				var circle = d3.select(this.svg[0][0].childNodes[i+5]);
				circle.attr('r', 4);
				circle.classed('active', false);
				this.toggleToolTip(false);
			})

		this.svg.append('g').attr('id', 'tooltip')
			.attr('transform', 'translate(-100,-100)')
			.attr('class', 'tip')
			.append('path')
			.attr('d', 'm1.74999,8.00043l0,0c0,-3.42177 3.56758,-6.19543 7.96823,-6.19543l3.62185,0l0,0l17.38534,0l32.59726,0c2.11353,0 4.14029,0.65274 5.63466,1.81467c1.49402,1.16192 2.33368,2.73772 2.33368,4.38076l0,15.4886l0,0l0,9.29327l0,0c0,3.42158 -3.56772,6.19535 -7.96834,6.19535l-32.59726,0l33.65634,-0.0432l-51.04168,0.0432l-3.62185,0c-4.40065,0 -7.96823,-2.77377 -7.96823,-6.19535l0,0l0,-9.29327l0,0l0,-15.4886z')

		d3.select('#tooltip')
			.append('g')
			.attr('class', 'content')
			.attr('transform', 'translate(36, 17)');
	}

	movePlots(){
		this.svg.selectAll('circle')
			.transition()
			.duration(1000)
			.ease('exp')
			.attr('cx', (d, i) => this.xScale(this.dates[i]))
			.attr('cy', (d, i) => this.yScale(this.units[i]))
	}

	tweenChart(){
		this.area = d3.svg.area()
			//.interpolate('cardinal')
			.x((d, i) => this.xScale(this.dates[i]))
			.y0( (d) => this.areaHeight)
			.y1((d, i) => this.yScale(this.units[i]));

		this.path
			.datum(this.data)
			.transition()
			.duration(1000)
			.ease('exp')
			.attr('d', this.area)
			.attr('stroke', '#429A86')
			.attr('stroke-width', 1)
			.attr('fill', 'rgba(204, 204, 204, .4)');
	}

	toggleYAxes(){
		d3.selectAll('.currentY').remove();

		this.yScale = d3.scale.linear()
			.domain(d3.extent(this.units))
			.range([240, 0]);

		this.yAxis = d3.svg.axis()
			.scale(this.yScale)
			.orient('left');

		this.svg.append('g')
			.attr('class', 'y axis currentY')
			.attr('transform', 'translate(40, 10)')
			.call(this.yAxis);

		this.svg.append("g")
			.attr("class", "y grid currentY")
			.attr('id', '#grid')
			.attr('transform', 'translate(40, 10)')

			.call(this.yGridLine()
				.tickSize(-this.w, 0, 0)
				.tickFormat("")
		);

		d3.selectAll('.axis.currentY').transition().style('opacity' , 1);
		d3.selectAll('.grid.currentY').transition().style('opacity' ,.5);
	}

	toggleToolTip(b, xVal, yVal, date, weight){
		date = String(date).substr(4, 11);
		if(b){
			d3.select('#tooltip')
				.attr('transform', 'translate(' + (xVal + 5) + ',' + (yVal) + ')')
				.classed('active', true);

			d3.selectAll('.content text').remove();
			d3.select('.content').append('text').attr('class', 'date').text(date);
			d3.select('.content').append('text').attr('class', 'weight').attr('transform', 'translate(2,15)').text(weight + this.selectedUnit);
		} else {
			d3.select('#tooltip')
				.classed('active', false);
		}
	}

	selectUnit(e){
		this.selectedUnit = e.target.id === 'kg' ? 'kg' : 'lb';
		this.setUnit();
		this.toggleYAxes();
	}

	selectYear(e){
		this.selectedYear = e.target.id;
		this.getData(false);
	}

	render(){
		return (
			<div id="weight-tracker">
				<h1>Weight history</h1>
				<svg id="svg" width={this.w + this.margin.left + this.margin.right} height={this.h + this.margin.top + this.margin.bottom}></svg>
				<div className="radios">
					<div>
						<label className="control">2014
							<input type="radio" className="year" name="year" id="2014" defaultChecked="true" onClick={this.selectYear} />
							<div className="indicator"></div>
						</label>
						<label className="control year">2015
							<input type="radio" className="year" name="year" id="2015" onClick={this.selectYear} />
							<div className="indicator"></div>
						</label>
					</div>
					<div>
						<label className="control">Kgs
							<input type="radio" className="unit" name="unit" id="kg" defaultChecked="true" onClick={this.selectUnit} />
							<div className="indicator"></div>
						</label>
						<label className="control lbs">Lbs
							<input type="radio" className="unit" name="unit" id="lb" onClick={this.selectUnit} />
							<div className="indicator"></div>
						</label>
					</div>
				</div>
			</div>
		)
	}
}

export default Tracker;