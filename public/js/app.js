import React from 'react';
import Chart from '../../public/components/Chart';
import SearchAPI from '../../public/components/SearchAPI';

React.render(<Chart/>, document.getElementById('chart-container'));
React.render(<SearchAPI/>, document.getElementById('search-api-container'));