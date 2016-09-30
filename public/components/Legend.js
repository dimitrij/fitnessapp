//stateless functional component
import React from 'react';

let Legend = props => (
    
    <ul id="legend">
        <li>
            <div className="legend blue"></div>Calories consumed <span className="amount">{props.dataCurrentConsumed}</span>
        </li>
        <li>
            <div className="legend green"></div>Calories burned <span className="amount">{props.dataCaloriesBurned}</span>
        </li>
        <li>
            <div className="legend red"></div>Excess calories <span className="amount">{props.dataExcessConsumed <= 0 ? 0 : props.dataExcessConsumed}</span>
        </li>
        {props.dataExcessConsumed <= 0 &&
        <li>
            <p>Today you have <span className="calories-consumed">{-props.dataExcessConsumed}</span> calories remaining</p>
        </li>
        }
        {props.dataExcessConsumed > 0 &&
        <li>
            <p>You have exceeded your daily calorie intake by {props.dataExcessConsumed} calories</p>
        </li>
        }
    </ul>
);

export default Legend;