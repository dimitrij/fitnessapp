var express = require('express');
var router = express.Router();

router.get('/user', function(req, res) {
	var db = req.db;
	var collection = db.get('weighttracker.user');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

router.get('/todaysfoods', function(req, res) {
	var db = req.db;
	var collection = db.get('weighttracker.todaysfoods');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

router.put('/updatecalories', function(req, res) {
	var db = req.db;
	var collection = db.get('weighttracker.user');

	collection.update({ _id : "570d0c77b1cfd5f2a480f5ba"}, {$set:{totalCalories : req.body.totalCalories}}, {safe:true},
		function(err){
			res.send(
				(err === null) ? { msg: '' } : { msg: err }
			);
	});
});

router.put('/addfood', function(req, res) {
	var db = req.db,
		collection = db.get('weighttracker.todaysfoods'),
		item = req.body,
		meal = item['meal'],
		object;

	delete item.meal;
	object = { $push: {} };
	object.$push['meals.' + meal + '.food'] = item;

	collection.update({}, object,
		function(err) {
			res.send((err === null) ? { msg: 'food added' } : { msg:'error: ' + err });
		});
});

router.put('/deletefood', function(req, res) {
	var db = req.db,
		collection = db.get('weighttracker.todaysfoods'),
		item = req.body,
		meal = item['meal'],
		object;

	delete item.meal;
	object = { $pull: {} };
	object.$pull['meals.' + meal + '.food'] = item;

	collection.update({}, object,
		function(err) {
			res.send((err === null) ? { msg: 'food deleted' } : { msg:'error: ' + err });
	});
});

module.exports = router;
