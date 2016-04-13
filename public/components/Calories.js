import React from 'react';
import d3 from '../../node_modules/d3/d3.min';

class Calories extends React.Component{

	componentWillReceiveProps(nextProps){
		this.id = nextProps.data.id;
		this.width = 400;
		this.totalCalories = nextProps.data.dataTotalCals;
		this.consumed = nextProps.data.consumed;
		this.consumedAsPct = (this.consumed / this.totalCalories) * 100;
		this.ofCirc = (this.consumedAsPct / 100) * nextProps.data.circ;
		this.innerRadius = nextProps.data.innerRadius;
		this.outerRadius = nextProps.data.outerRadius;
		this.bgColour = nextProps.data.bgColour;
		this.fgColour = nextProps.data.fgColour;
		this.arc = d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius).startAngle(0);
		this.dialClass = '';

		if(this.id === 'excess-consumed') {
			this.dialClass = 'excess-dial';
			if(this.consumed <= 0){
				return;
			}
		}

		this.bg = d3.select('#calories svg g').append('path')
			.datum({endAngle: nextProps.data.circ})
			.style('fill', this.bgColour)
			.attr('f', 'sdfsd')
			.attr('d', this.arc);

		this.fgColour = d3.select('#calories svg g').append('path')
			.datum({endAngle: 0})
			.style('fill', this.fgColour)
			.attr('d', this.arc)
			.attr('class', this.dialClass );
			/*.on('mouseover', () => {
				this.offsetWidth = document.getElementById(this.id).getBBox().width;
				d3.select('#' + this.id).attr('transform', 'translate(' + ((this.width/2) - this.offsetWidth - 20) + ',-160)');
				d3.select('#today').attr('transform', 'translate(' + ((this.width/2) - this.offsetWidth - 20) + ',-175)');
				d3.select('#today').classed('visible', true);
				d3.select('#' + this.id).classed('visible', true);
				d3.select('#more-data').remove();
			})
			.on('mouseout', () => {
				d3.selectAll('.info').classed('visible', false);
			});*/

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