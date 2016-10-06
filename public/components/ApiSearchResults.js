import React from 'react';
import $ from '../js/utils';
import ApiService from '../services/ApiService';
const apiService = new ApiService();

class ApiSearchResults extends React.Component {
    constructor() {
        super();
        this.selectResult = this.selectResult.bind(this);
        this.amount = null;
        this.selectedMeal = null;
    }
    
    selectResult(result, e){
        this.amount = e.target.parentNode.parentNode.getElementsByTagName('input')[0].value;
        $.$('#search-api').value = '';
        this.addFood(result, this.amount);
        $.removeClass(this.refs.results, 'active');
    }
    
    selectMeal(e){
        let foods = [...e.target.parentNode.getElementsByTagName('li')];
        this.selectedMeal = e.target.getAttribute('data-meal');
        
        for(let food of foods){
            $.removeClass(food, 'active')
        }
        
        $.addClass(e.target, 'active');
    }
    
    addFood(food, amount){
        
        food['meal'] = this.selectedMeal;
        food.calories *= amount;
        food.carbs *= amount;
        food.fat *= amount;
        food.protein *= amount;
        food.sodium *= amount;
        food.sugar *= amount;
        
        apiService.addFood(food).end((err, res) => {
            if (res.ok){
                this.props.todaysFoods();
            } else {
                console.log(err);
            }
        });
        
    }
    
    render(){
        return (
            <div>
                <ul ref="results" className={this.props.results.length > 0 ? 'results active' : 'results'}>
                    {this.props.results.map((result, index) => {
                        if(result.name.toLowerCase().indexOf(this.props.query.toLowerCase()) !== -1 && this.props.query !== '') {
                            return <li key={index} className="item">
                                <p>{result.name}
                                    <button onClick={this.selectResult.bind(this, result)}>Add</button>
                                </p>
                                <div>
                                    <input type="text" className="servings" defaultValue="1" /> serving(s)
                                    <ul className="meal" onClick={this.selectMeal.bind(this)}>
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

export default ApiSearchResults;