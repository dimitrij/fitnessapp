import React from 'react';
import fitnessApp from '../js/reducers'
import { updateCalories } from '../js/actions';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

const MealTotalsComponent = props => {
    
    let totalCalories = 0,
        totalCarbs = 0,
        totalFat = 0,
        totalProtein = 0,
        totalSodium = 0,
        totalSugar = 0;
    
    props.foods.map(food => {
        totalCalories += food.calories;
        totalCarbs += food.carbs;
        totalFat += food.fat;
        totalProtein += food.protein;
        totalSodium += food.sodium;
        totalSugar += food.sugar;
    })
    
    props.actions.updateCalories(totalCalories);
    
    //console.log('getState', store.getState())
    /*let unsubscribe = store.subscribe(() =>
     console.log(store.getState())
     )*/
    
    
    return (<ul className="selected-foods">
        <li className="totals clearfix">
            <span className="food-name">Totals</span>
            <span>{totalCalories}</span>
            <span>{totalCarbs}</span>
            <span>{totalFat}</span>
            <span>{totalProtein}</span>
            <span>{totalSodium}</span>
            <span>{totalSugar}</span>
        </li>
    </ul>)
}

let mapDispatchToProps = dispatch => ({ actions: bindActionCreators({ updateCalories }, dispatch) });

/*function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ updateCalories }, dispatch) }
}*/

const MealTotals = connect(null, mapDispatchToProps)(MealTotalsComponent);

export default MealTotals;