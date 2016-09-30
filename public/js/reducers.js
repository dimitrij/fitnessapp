import { combineReducers } from 'redux'
import { UPDATE_CALORIES } from './actions'

const calories = (state = 0, action) => {
    switch (action.type) {
        case UPDATE_CALORIES:
            
            //return Object.assign({}, state, {calories: action.calories});
    
            /*return {
                ...state,
                calories: action.calories
            }*/
            
            return action.calories
        default:
            return state
    }
}

const fitnessApp = combineReducers({
    calories
})

export default fitnessApp