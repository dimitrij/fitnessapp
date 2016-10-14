import React from 'react';
import d3 from '../../node_modules/d3/d3.min';

class Calories extends React.Component{
	
	constructor(props){
		super(props);
		console.log(props);
		this.width = 400;
		this.innerRadius = props.data.innerRadius;
		this.outerRadius = props.data.outerRadius;
		this.bgColour = props.data.bgColour;
		this.fg = props.data.fgColour;
		this.arc = d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius).startAngle(0);
		this.dialClass = '';
		this.circ = 2 * Math.PI;
	}

	componentWillReceiveProps(nextProps){
		this.id = nextProps.data.id;
		this.consumedAsPct = (nextProps.data.consumed / nextProps.data.dataTotalCals) * 100;
		this.ofCirc = (this.consumedAsPct / 100) * this.circ;

		if(this.id === 'excess-consumed') {
			this.dialClass = 'excess-dial';
			if(nextProps.data.consumed <= 0){
				return;
			}
		}
		
		d3.select('#calories svg g').append('path')
			.datum({endAngle: this.circ})
			.style('fill', this.bgColour)
			.attr('f', '')
			.attr('d', this.arc);


		this.fgColour = d3.select('#calories svg g').append('path')
			.datum({endAngle: 0})
			.style('fill', this.fg)
			.attr('d', this.arc)
			.attr('class', this.dialClass );

		this.arcTween = (transition, newAngle) => {
			transition.attrTween('d', (d) => {
				var interpolate = d3.interpolate(d.endAngle, newAngle);
				return (t) => {
					d.endAngle = interpolate(t);
					return this.arc(d);
				};
			});
		};

		this.fgColour.transition()
			.duration(1300)
			.call(this.arcTween, this.ofCirc);

	}

	render(){
		return (
			<div></div>
		);
	}

}

export default Calories;