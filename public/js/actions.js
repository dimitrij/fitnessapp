export const UPDATE_CALORIES = 'UPDATE_CALORIES';
export const TOTAL_CALORIES = 'TOTAL_CALORIES';
export const CURRENT_CONSUMED = 'CURRENT_CONSUMED';

export const updateCalories = (calories) => {
    return {
        type: 'UPDATE_CALORIES',
        calories
    }
};

export const getTotalCalories = (calories) => {
    return {
        type: 'TOTAL_CALORIES',
        calories
    }
};

export const updateCurrentConsumed = (calories) => {
    return {
        type: 'CURRENT_CONSUMED',
        calories
    }
};