var express = require('express');
var router = express.Router();

router.get('/user', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

router.put('/updatecalories', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');

	collection.update({ _id : "5665564c5a9958cc34a5b7eb"}, {$set:{totalCalories : req.body.totalCalories}}, {safe:true}, function(err, result){
		console.log('totalCalories', req.body.totalCalories)
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

module.exports = router;
