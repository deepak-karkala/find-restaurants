var request = require('request');

var apiOptions = {
  server: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://protected-waters-29134.herokuapp.com/";
}

var renderHomePage = function(req, res, responseBody){
  var message;
  if (!(responseBody instanceof Array)) {
    message = "API lookup error";
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = "No nearby places found"
    }
  }
  res.render('locations-list', { 
    title: 'Restaurants Near Me',
    pageHeader:{
      title: 'Restaurants Near Me',
      strapline: 'Find nearby restaurants'
    },
    sidebar: "Looking for a place to have a sumptuous meal ? Restaurants Near Me helps you locate the restaurants close to you.",
    locations: responseBody
    //message: message
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
      lng : 6.5668,
      lat : 46.5191,
      maxDistance : 100
    }
  };
  request(
    requestOptions,function(err,response,body){
      //console.log(body)
      renderHomePage(req, res, body);
    });

};


var renderDetailPage = function (req, res, locd) {
  res.render('location-detail', { 
    title: locd.name,
    pageHeader: {title: locd.name},
    sidebar: {
      context: 'is a nice place to have meal with great ambience.',
      callToAction: 'If you have been here, kindly add a review'
    },
    location: locd
  });
};

var getLocationInfo = function (req, res, callback) {
  var requestOptions, path;
  path = "/api/locations/" + req.params.locationid;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  }; 
  request(
    requestOptions,
    function(err, response, body) {
      var data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng : body.coords[0],
          lat : body.coords[1]
        };
        callback(req, res, data);
      } else { 
        _showError(req, res, response.statusCode);
      }
    }); 
};

/* GET 'Location info' page */
module.exports.detail = function(req, res){
  getLocationInfo(req, res, function(req, res, responseData) {
    renderDetailPage(req, res, responseData);
  });
};

var renderReviewForm = function (req,res,locd) {
  res.render('location-review', {
    title: 'Review' + locd.name,
    pageHeader: { title: 'Review' + locd.name}   
  });
};

/* GET 'Add review' page */
module.exports.review = function(req, res){
  getLocationInfo(req, res, function(req, res, responseData){
    renderReviewForm(req, res, responseData);
  });
};


module.exports.addReview = function(req, res) {
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = "/api/locations/" + locationid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };
  if (!postdata.author || !postdata.reviewText) {
    res.redirect('/location/' + locationid + '/reviews/new?err=val');
  } else {
    request(
      requestOptions,
      function (err, response, body) {
        if (response.statusCode === 201) {
          res.redirect('/location/' + locationid);
        } else if (response.statusCode === 400 && body.name && body.name === "ValidationError"){
          res.redirect('/location' + locationid + '/reviews/new?err=val')
        } else {
          console.log(body);
          _showError(req, res, response.statusCode);
        }
      });
  }
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Cannot find the requested page. Sorry";
  } else {
    title = status + ", Something is wrong";
    content = "Cannot find the requested page. Sorry";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};
