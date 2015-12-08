import React from 'react';
import Request from '../../node_modules/superagent/lib/client';
import Utils from '../js/utils';

class SearchAPI extends React.Component {

	constructor(){
		super();
		this.searchApi = this.searchApi.bind(this);
		const apiUrl = 'http://api.exchangeratelab.com/api/current/GBP?apikey=';
		const apiKey = 'F06383D65BCBFF52629D059B7D3EEB7D&callback=JSON_CALLBACK';

		this.state = {
			searchResults: []
		}
	}

	searchApi(e){
		let query = e.target.value;

		Request
			.get('../../data/data.json')
			.end((err, res) => {
				if (res.ok) {
					this.setState({searchResults : res.body['2014']});
				}  else {
					console.log('error');
				}
		})
	}

	componentDidMount(){}

	render(){

		return (
			<div id="search">
				<input type="text" ref="searchApi" id="search-api" onChange={this.searchApi} placeholder="Search database" />
				<ApiSearchResults results={this.state.searchResults}/>
			</div>
		)
	}
}

class ApiSearchResults extends React.Component {
	constructor() {
		super();
		this.selectResult = this.selectResult.bind(this);
	}

	selectResult(e){
		Utils.$('#search-api').value = e.target.innerHTML;
		Utils.removeClass(React.findDOMNode(this), 'active');
		console.log(e.target.innerHTML)

	}

	render(){
		return (
			<ul className={this.props.results.length > 0 && 'active'}>
				{this.props.results.map((result) => {
					console.log('zzz')
					return <li className="item" onClick={this.selectResult}>
						<p>Sainsbury's Tast The Difference Venison Burger</p>
						<div>
							<input type="text" className="servings" /> servings of 1 burger
							<ul>
								<li>breakfast</li>
								<li>lunch</li>
								<li>dinner</li>
							</ul>
						</div>
					</li>
				})}
			</ul>
		)
	}
}

export default SearchAPI;