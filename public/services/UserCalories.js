'use strict';

import AppState from './AppState.js';

let cursors = {
    consumedCalories: AppState.select('calories', 'consumed'),
    burnedCalories: AppState.select('calories', 'burned')
};

let userCalories = {

    updateCalories (total) {
        var itemCursor = AppState.select('calories', 'consumed');
        itemCursor.select('calories', 'consumed').set(total);
    },

    getCalories () {
        return cursors.consumedCalories.get()
    }

};

export {cursors, userCalories};
