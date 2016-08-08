var mongoose = require('mongoose');
var Rnm = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.reviewsCreate = function (req,res) {
	var locationid = req.params.locationid;
	if (locationid) {
		Rnm
			.findById(locationid)
			.select('reviews')
			.exec(
				function(err, location){
					if (err) {
						sendJsonResponse(res, 400, err);
					} else {
						doAddReview(req, res, location);
					}
				})
	} else {
		sendJsonResponse(res, 404, {"message": "locationid not found"});
	}
};


var doAddReview = function(req, res, location) {
	if (!location) {
		sendJsonResponse(res, 404, {"message": "location id not found"});
	} else {
		location.reviews.push({
			author: req.body.author,
			reviewText: req.body.reviewText
		});
		location.save(function(err,location) {
			var thisReview;
			if (err) {
				console.log(err);
				sendJsonResponse(res, 400, err);
			} else {
				thisReview = location.reviews[location.reviews.length-1];
				sendJsonResponse(res, 201, thisReview);
			}
		});
	}
};


module.exports.reviewsReadOne = function (req,res) {
	if (req.params && req.params.locationid && req.params.reviewid) {
		Rnm
			.findById(req.params.locationid)
			.select('name reviews')
			.exec(
				function(err, location){
					var response, review;
					if (!location) {
						sendJsonResponse(res, 404, {"message":"locationid not found"});
						return;
					} else if (err) {
						sendJsonResponse(res, 400, err);
						return;
					}
					if (location.reviews && location.reviews.length > 0){
						review = location.reviews.id(req.params.reviewid);
						if (!review) {
							sendJsonResponse(res,404,{"message":"reviewid not found"});
						} else {
							response = {
								location : {
									name : location.name,
									id : req.params.locationid
								},
								review : review
							},
							sendJsonResponse(res, 200, response);
						}
					} else {
						sendJsonResponse(res, 404, {"message": "No reviews found"});
					}
				});
	} else {
		sendJsonResponse(res, 404, {"message": "locationid and reviewid are both required"});
	}
	
};