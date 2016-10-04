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
			this.getApiDataCallback(err, res);
		});
	}

	getApiDataCallback(err, res){
		if (res.ok) {
			//will need to send search params to api, and not load all results on keypress
			let breakfast =  res.body['meals']['breakfast']['food'],
				lunch =  res.body['meals']['lunch']['food'],
				dinner =  res.body['meals']['dinner']['food'],
				snacks =  res.body['meals']['snacks']['food'],
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
	
	getTodaysFoods(){
		searching = false;
		apiService.getTodaysFoods().end((err, res)=>{
			this.todaysFoodsCallback(err, res);
		});
	}

	todaysFoodsCallback(err, res){
		if (res.ok){
			this.meals = res.body;

			if(this.meals && this.meals[0]){
				this.setState({
					breakfastList : this.meals[0]['meals']['breakfast']['food'],
					lunchList : this.meals[0]['meals']['lunch']['food'],
					dinnerList : this.meals[0]['meals']['dinner']['food'],
					snacksList : this.meals[0]['meals']['snacks']['food'],
					foodsList : this.meals[0]['meals']['breakfast']['food'].concat(this.meals[0]['meals']['lunch']['food'].concat(this.meals[0]['meals']['dinner']['food'].concat(this.meals[0]['meals']['snacks']['food'])))
				});
			}

		} else {
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

				<FoodList foodsList={this.state.foodsList}
						  breakfastList={this.state.breakfastList}
						  lunchList={this.state.lunchList}
						  dinnerList={this.state.dinnerList}
						  snacksList={this.state.snacksList}
						  todaysFoods={this.getTodaysFoods} /> {/*load today's selected foods from db on page load*/}
			</div>
		)
	}
}

export default SearchAPI;