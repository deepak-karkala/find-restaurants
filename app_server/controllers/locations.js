/* GET 'home' page */
module.exports.list = function(req, res){
  res.render('locations-list', { 
  	title: 'Restaurants Near Me',
  	pageHeader:{
  		title: 'Restaurants Near Me',
  		strapline: 'Find nearby restaurants'
  	},
  	sidebar: "Looking for a place to have a sumptuous meal ? Restaurants Near Me helps you locate the restaurants close to you.",
  	locations: [{
  		name: 'Starmeal',
  		address: '123 First street, Neverland'	
  	},{
  		name: 'Meal Hero',
  		address: '789 Third street, Yesterdayland'	
  	},{
  		name: 'Meal King',
  		address: '456 Second street, Tomorrowland'	
  	}] 
  });
};

/* GET 'Location info' page */
module.exports.detail = function(req, res){
  res.render('location-detail', { 
  	title: 'Starmeal',
  	pageHeader: {title: 'Starmeal'},
  	location: {
  		name: 'Starmeal',
  		address: '123 First street, Neverland',
  		coords: {lat: 46.541292, lng: 6.629719},
  		reviews: [{
  			author: 'Deepak Karkala',
  			reviewText: 'Great place. I highly recommend it.'	
  		}]
  	}

  });
};

/* GET 'Add review' page */
module.exports.review = function(req, res){
  res.render('location-review', {
   title: 'Add review',
   pageHeader: { title: 'Review Starcups'} 
  });
};


