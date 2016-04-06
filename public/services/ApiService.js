import React from 'react';
import Request from '../../node_modules/superagent/lib/client';

class ApiService {

	getTodaysFoods(){
		return Request.get('/users/todaysfoods')
	}

}

export default ApiService;
