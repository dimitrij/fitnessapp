import React from 'react';
import Meal from './Meal';
import MealTotals from './MealTotalsComponent';

const FoodList = props => (
    
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
            
            <Meal items={props.breakfastList}
                  todaysFoods={props.todaysFoods}
                  meal="breakfast"/>
            
            <Meal items={props.lunchList}
                  todaysFoods={props.todaysFoods}
                  meal="lunch"/>
            
            <Meal items={props.dinnerList}
                  todaysFoods={props.todaysFoods}
                  meal="dinner"/>
            
            <Meal items={props.snacksList}
                  todaysFoods={props.todaysFoods}
                  meal="snacks"/>
            
            <MealTotals	foods={props.foodsList}/>
        
        </div>
    
    </div>
)

export default FoodList;