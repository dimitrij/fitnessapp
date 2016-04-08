/**
 * Central application state
 */

'use strict';

import Baobab from 'baobab';

let AppState = new Baobab({

    'calories': {
        'consumed': 0,
        'burned': 0
    }

});

export default AppState;
