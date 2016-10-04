import React from 'react';
import ApiService from '../services/ApiService';

let caloriesTotal = 0,
    carbsTotal = 0,
    fatTotal = 0,
    proteinTotal = 0,
    sodiumTotal = 0,
    sugarTotal = 0,
    apiService = new ApiService();
    
class Meal extends React.Component {
    
    removeFood(food, meal){
        
        food['meal'] = meal;
        
        apiService.removeFood(food).end((err, res) => {
            this.removeFoodCallback(err, res);
        });
    }
    
    removeFoodCallback(err, res){
        if (res.ok){
            this.props.todaysFoods();
        } else {
            console.log(err);
        }
    }
    
    resetTotals(){
        caloriesTotal = 0;
        carbsTotal = 0;
        fatTotal = 0;
        proteinTotal = 0;
        sodiumTotal = 0;
        sugarTotal = 0;
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
                    
                    return <li className="clearfix" key={food.name}>
                        <span className="food-name" title={food.name}>{food.name}</span>
                        <span>{food.calories}</span>
                        <span>{food.carbs}</span>
                        <span>{food.fat}</span>
                        <span>{food.protein}</span>
                        <span>{food.sodium}</span>
                        <span>{food.sugar}</span>
                        <span className="remove" onClick={this.removeFood.bind(this, food, this.props.meal)}>remove</span>
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
                
                {this.resetTotals()}
            
            </ul>
        )
    }
}

export default Meal;