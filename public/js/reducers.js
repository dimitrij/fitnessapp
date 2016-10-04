import { combineReducers } from 'redux';
import { UPDATE_CALORIES } from './actions';
import { TOTAL_CALORIES } from './actions';
import { CURRENT_CONSUMED } from './actions';

const calories = (state = 0, action) => {
    switch (action.type) {
        case UPDATE_CALORIES:
            
            //return Object.assign({}, state, {calories: action.calories});
    
            /*return {
                ...state,
                calories: action.calories
            }*/
            
            return action.calories;
        default:
            return state
    }
}

const totalCalories = (state = 0, action) => {
    switch (action.type) {
        case TOTAL_CALORIES:
            return action.calories;
        default:
            return state
    }
}

const currentConsumed = (state = 0, action) => {
    switch (action.type) {
        case CURRENT_CONSUMED:
            return action.calories;
        default:
            return state
    }
}

const fitnessApp = combineReducers({
    calories,
    totalCalories,
    currentConsumed
});

export default fitnessApp