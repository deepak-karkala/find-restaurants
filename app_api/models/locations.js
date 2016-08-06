var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	author: String,
	reviewText: String
});

var locationSchema = new mongoose.Schema({
	name: {type: String, required: true},
	address: String,
	coords: {type: [Number], index: '2dshpere', required: true},
	reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);