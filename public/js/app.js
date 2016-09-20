import React from 'react';
import ReactDOM from 'react-dom';
import Chart from '../../public/components/Chart';
import SearchAPI from '../../public/components/SearchAPI';

ReactDOM.render(<Chart/>, document.getElementById('chart-container'));
ReactDOM.render(<SearchAPI/>, document.getElementById('search-api-container'));