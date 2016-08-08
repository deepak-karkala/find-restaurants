var request = require('request');

var apiOptions = {
  server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://protected-waters-29134.herokuapp.com/";
}

var renderHomePage = function(req, res, respnseBody){
  res.render('locations-list', { 
    title: 'Restaurants Near Me',
    pageHeader:{
      title: 'Restaurants Near Me',
      strapline: 'Find nearby restaurants'
    },
    sidebar: "Looking for a place to have a sumptuous meal ? Restaurants Near Me helps you locate the restaurants close to you.",
    locations: respnseBody
  });
};

/* GET 'home' page */
module.exports.list = function(req, res){
  var requestOptions, path;
  path = '/api/locations';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {
      lng : 6.63,
      lat : 46.55,
      maxDistance : 100
    }
  };
  request(
    requestOptions,function(err,response,body){
      //console.log(body)
      renderHomePage(req, res, body);
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


