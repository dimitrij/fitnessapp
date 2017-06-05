import React from 'react';
import ApiService from '../services/ApiService';
import ApiSearchResults from './ApiSearchResults';
import FoodList from './FoodList';

let apiService = new ApiService();
let searching = false;

class SearchAPI extends React.Component {

	constructor(){
		super();
		this.searchApi = this.searchApi.bind(this);
		this.getTodaysFoods = this.getTodaysFoods.bind(this);

		this.state = {
			searchResults: [],
			breakfastList : [],
			lunchList : [],
			dinnerList : [],
			snacksList : [],
			foodsList : []
		};

		this.getTodaysFoods();
	}
	
	getTodaysFoods(){
		searching = false;
		apiService.getTodaysFoods().end((err, res)=>{
			this.todaysFoods(err, res);
		});
	}
	
	todaysFoods(err, res){
		if (res.ok){
			this.meals = res.body;
			if(this.meals && this.meals[0]){
				let meals = this.meals[0]['meals'];
				this.setState({
					breakfastList : meals['breakfast']['food'],
					lunchList : meals['lunch']['food'],
					dinnerList : meals['dinner']['food'],
					snacksList : meals['snacks']['food'],
					foodsList : meals['breakfast']['food'].concat(meals['lunch']['food'].concat(meals['dinner']['food'].concat(meals['snacks']['food'])))
				});
			}
			
		} else {
			console.log(err);
		}
	}

	searchApi(e){
		searching = true;
		if(e.target.value === ''){
			this.setState({
				searchResults : []
			});
			return;
		}

		this.query = e.target.value;

		apiService.getApiData().end((err, res)=>{
			this.getApiData(err, res);
		});
	}

	getApiData(err, res){
		if (res.ok) {
			//will need to send search params to api, and not load all results on keypress
			let meals = res.body['meals'],
				breakfast =  meals['breakfast']['food'],
				lunch =  meals['lunch']['food'],
				dinner =  meals['dinner']['food'],
				snacks =  meals['snacks']['food'],
				foods = breakfast.concat(lunch.concat(dinner.concat(snacks)));

			this.setState({
				searchResults : foods,
				query : this.query
			});

			searching = false;

		}  else {
			console.log(err);
		}
	}

	render(){
		return (
			<div id="search">
				<input type="text" ref="searchApi" id="search-api"
					   onChange={this.searchApi}
					   placeholder="Type to search database" />

				<div className="select-dbs radios">
					<label className="control">Foods database
						<input type="radio" name="db" defaultChecked="true" />
						<div className="indicator"></div>
					</label>
					<label className="control lbs">Your foods
						<input type="radio" name="db" />
						<div className="indicator"></div>
					</label>
				</div>

				<ApiSearchResults query={this.state.query}
								  results={this.state.searchResults}
								  todaysFoods={this.getTodaysFoods} />
				
				{/*load today's selected foods from db on page load*/}
				<FoodList {...this.state} todaysFoods={this.getTodaysFoods} />
			</div>
		)
	}
}

export default SearchAPI;