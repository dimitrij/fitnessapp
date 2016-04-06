var express = require('express');
var router = express.Router();

router.get('/user', function(req, res) {
	var db = req.db;
	var collection = db.get('user');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

router.get('/todaysfoods', function(req, res) {
	var db = req.db;
	var collection = db.get('todaysfoods');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

router.put('/updatecalories', function(req, res) {
	var db = req.db;
	var collection = db.get('user');

	collection.update({ _id : "56f14e3f3750b4be64fe3996"}, {$set:{totalCalories : req.body.totalCalories}}, {safe:true},
		function(err){
			res.send(
				(err === null) ? { msg: '' } : { msg: err }
			);
	});
});

router.put('/addfood', function(req, res) {
	var db = req.db,
		collection = db.get('todaysfoods'),
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
		collection = db.get('todaysfoods'),
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
