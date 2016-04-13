import Request from '../../node_modules/superagent/lib/client';

class ApiService {

	getTodaysFoods(){
		return Request.get('/users/todaysfoods');
	}

	getApiData(){
		return Request.get('../../data/mfpapi.json');
	}

	addFood(food){
		return Request.put('/users/addfood').set('Accept', 'application/json').send(food);
	}

	removeFood(food){
		return Request.put('/users/deletefood').set('Accept', 'application/json').send(food);
	}

	getUser(){
		return Request.get('/users/user');
	}

	updateCalories(newDailyPermitted){
		return Request.put('/users/updatecalories').set('Accept', 'application/json').send(newDailyPermitted);
	}

}

export default ApiService;
