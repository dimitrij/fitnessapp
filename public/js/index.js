import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import fitnessApp from './reducers'
let store = createStore(fitnessApp)
import App from '../components/App'

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
)