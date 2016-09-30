export const UPDATE_CALORIES = 'UPDATE_CALORIES';

export const updateCalories = (calories) => {
    return {
        type: 'UPDATE_CALORIES',
        calories
    }
}