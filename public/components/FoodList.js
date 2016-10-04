import React from 'react';
import Meal from './Meal';
import MealTotals from './MealTotalsComponent';

let searching = false;

//make stateless component, remove state and shouldComponentUpdate

class FoodList extends React.Component {
        
    constructor(){
        super();
        this.state = {
            totalCalories: 0
        }
    }
    
    shouldComponentUpdate(){
        return !searching;
    }
    
    render(){
        return (
            <div>
                <ul className="selected-foods headers">
                    <li className="clearfix">
                        <span> </span>
                        <span>Calories</span>
                        <span>Carbs</span>
                        <span>Fat</span>
                        <span>Protein</span>
                        <span>Sodium</span>
                        <span>Sugar</span>
                        <span> </span>
                    </li>
                </ul>
                
                <div className="selected-foods-container">
                    
                    <Meal items={this.props.breakfastList}
                          todaysFoods={this.props.todaysFoods}
                          meal="breakfast"/>
                    
                    <Meal items={this.props.lunchList}
                          todaysFoods={this.props.todaysFoods}
                          meal="lunch"/>
                    
                    <Meal items={this.props.dinnerList}
                          todaysFoods={this.props.todaysFoods}
                          meal="dinner"/>
                    
                    <Meal items={this.props.snacksList}
                          todaysFoods={this.props.todaysFoods}
                          meal="snacks"/>
                    
                    <MealTotals	foods={this.props.foodsList}/>
                
                </div>
            
            </div>
        
        )
    }
}

export default FoodList;