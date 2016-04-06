import React from 'react';
import Request from '../../node_modules/superagent/lib/client';
//import ApiService from '../services/ApiService.js';
import $ from '../js/utils';

//Phase 1
//make calories consumed / burned / excess dynamic (on load and on adding food)
//debounce daily calorie intake input
//get search data from real API
//new db table for all user's previously selected foods, and related UI search
//$pull only one element from array
//validation on adding meal
//add correct calories depending on number of servings
//ajax calls to ApiService.js
//better design...

let selectedMeal = null;
var caloriesTotal = 0, carbsTotal = 0, fatTotal = 0, proteinTotal = 0, sodiumTotal = 0, sugarTotal = 0;

function resetTotals(){
	caloriesTotal = 0;
	carbsTotal = 0;
	fatTotal = 0;
	proteinTotal = 0;
	sodiumTotal = 0;
	sugarTotal = 0;
}

class SearchAPI extends React.Component {

	constructor(){
		super();
		this.searchApi = this.searchApi.bind(this);
		this.getTodaysFoods = this.getTodaysFoods.bind(this);
		const apiUrl = 'http://api.exchangeratelab.com/api/current/GBP?apikey=';
		const apiKey = 'F06383D65BCBFF52629D059B7D3EEB7D&callback=JSON_CALLBACK';

		this.state = {
			searchResults: [],
			query : '',
			breakfastList : [],
			lunchList : [],
			dinnerList : [],
			snacksList : [],
			foodsList : []
		};

		this.getTodaysFoods();
	}

	searchApi(e){
		if(e.target.value === ''){
			this.setState({
				searchResults : []
			});
			return;
		}
		this.query = e.target.value;

		Request
			.get('../../data/mfpapi.json')
			.end((err, res) => {
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

				}  else {
					console.log('error');
				}
		})
	}

	getTodaysFoods(){
		Request
			.get('/users/todaysfoods')
			.end((err, res)=> {
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

				} else{
					console.log('error');
				}
			});
	}

	render(){
		return (
			<div id="search">
				<input type="text" ref="searchApi" id="search-api" onChange={this.searchApi} placeholder="Search database" />
				<ApiSearchResults query={this.state.query} results={this.state.searchResults} todaysFoods={this.getTodaysFoods} />
				<FoodList foodsList={this.state.foodsList} breakfastList={this.state.breakfastList} lunchList={this.state.lunchList} dinnerList={this.state.dinnerList} snacksList={this.state.snacksList} todaysFoods={this.getTodaysFoods} /> {/*load today's selected foods from db on page load*/}
			</div>
		)
	}
}

class ApiSearchResults extends React.Component {
	constructor() {
		super();
		this.selectResult = this.selectResult.bind(this);
		var selectedMeal = null;
	}

	selectResult(result){
		$.$('#search-api').value = '';
		this.addFood(result);
		$.removeClass(this.refs['results'].getDOMNode(), 'active')
	}


	selectMeal(e){
		let foods = e.target.parentNode.getElementsByTagName('li');
		selectedMeal = e.target.getAttribute('data-meal');

		for(let i = 0, j = foods.length; i < j; i++){
			$.removeClass(foods[i], 'active')
		}
		$.addClass(e.target, 'active');
	}

	addFood(food){
		resetTotals();

		food['meal'] = selectedMeal ;
		Request
			.put('/users/addfood')
			.set('Accept', 'application/json')
			.send(food)
			.end((err, res) => {
				if (res.ok){
					this.props.todaysFoods();
				} else{
					console.log('error');
				}
			});
	}

	render(){

		return (
			<div>
				<ul ref="results" className={this.props.results.length > 0 ? 'results active' : 'results'}>
					{this.props.results.map((result) => {
						if(result.name.toLowerCase().indexOf(this.props.query.toLowerCase()) !== -1 && this.props.query !== '') {
							return <li className="item">
								<p>{result.name}
									<button onClick={this.selectResult.bind(this, result)}>Add</button>
								</p>
								<div>
									<input type="text" className="servings" defaultValue="1" /> serving(s)
									<ul className="meal" onClick={this.selectMeal}>
										<li data-meal="breakfast">breakfast</li>
										<li data-meal="lunch">lunch</li>
										<li data-meal="dinner">dinner</li>
										<li data-meal="snacks">snacks</li>
									</ul>
								</div>
							</li>
						}
					})}
				</ul>
			</div>
		)
	}
}

class FoodList extends React.Component {

	constructor(){
		super();
		this.state = {
			totalCalories: 0
		}
	}

	componentWillReceiveProps(){}

	componentDidMount(){}

	render(){
		return (
			<div>
				<ul className="selected-foods">
					<li className="headers clearfix">
						<span></span>
						<span>Cals</span>
						<span>Carbs</span>
						<span>Fat</span>
						<span>Protein</span>
						<span>Sodium</span>
						<span>Sugar</span>
						<span> </span>
					</li>
				</ul>

				<Meal items={this.props.breakfastList} todaysFoods={this.props.todaysFoods} meal="breakfast"/>

				<Meal items={this.props.lunchList} todaysFoods={this.props.todaysFoods} meal="lunch"/>

				<Meal items={this.props.dinnerList} todaysFoods={this.props.todaysFoods} meal="dinner"/>

				<Meal items={this.props.snacksList} todaysFoods={this.props.todaysFoods} meal="snacks"/>

				<MealTotals foods={this.props.foodsList}/>

			</div>

		)
	}
}

class Meal extends React.Component {

	removeFood(food, meal){

		food['meal'] = meal;
		Request
			.put('/users/deletefood')
			.set('Accept', 'application/json')
			.send(food)
			.end((err, res) => {
				if (res.ok){
					this.props.todaysFoods();
				} else{
					console.log('error');
				}
			});
	}

	render(){
		return (
			<ul className="selected-foods">
				<li><h2>{this.props.meal}</h2></li>
				{this.props.items.map(food => {
					caloriesTotal += food.calories;
					carbsTotal += food.carbs;
					fatTotal += food.fat;
					proteinTotal += food.protein;
					sodiumTotal += food.sodium;
					sugarTotal += food.sugar;

					return <li className="clearfix">
						<span className="food-name" title={food.name}>{food.name}</span>
						<span>{food.calories}</span>
						<span>{food.carbs}</span>
						<span>{food.fat}</span>
						<span>{food.protein}</span>
						<span>{food.sodium}</span>
						<span>{food.sugar}</span>
						<span className="remove" onClick={this.removeFood.bind(this, food, this.props.meal)}>X</span>
					</li>
				})}

				<li className="totals clearfix">
					<span className="food-name">Total</span>
					<span>{caloriesTotal}</span>
					<span>{carbsTotal}</span>
					<span>{fatTotal}</span>
					<span>{proteinTotal}</span>
					<span>{sodiumTotal}</span>
					<span>{sugarTotal}</span>
				</li>

				{resetTotals()}

			</ul>
		)
	}
}

class MealTotals extends React.Component {

	render(){
		var totalCalories = 0,
			totalCarbs = 0,
			totalFat = 0,
			totalProtein = 0,
			totalSodium = 0,
			totalSugar = 0;

		{this.props.foods.map(food => {
			totalCalories += food.calories;
			totalCarbs += food.carbs;
			totalFat += food.fat;
			totalProtein += food.protein;
			totalSodium += food.sodium;
			totalSugar += food.sugar;
		})}

		return (
				<ul className="selected-foods">
					<li className="totals clearfix">
						<span className="food-name">Totals</span>
						<span>{totalCalories}</span>
						<span>{totalCarbs}</span>
						<span>{totalFat}</span>
						<span>{totalProtein}</span>
						<span>{totalSodium}</span>
						<span>{totalSugar}</span>
					</li>
				</ul>
		)
	}
}

export default SearchAPI;