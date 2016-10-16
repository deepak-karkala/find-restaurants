var mongoose = require('mongoose');
var Rnm = mongoose.model('Location');
var http = require('https');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

var theEarth = (function() {
  var earthRadius = 6371; // km, miles is 3959

  var getDistanceFromRads = function(rads) {
    return parseFloat(rads * earthRadius);
  };

  var getRadsFromDistance = function(distance) {
    return parseFloat(distance / earthRadius);
  };

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  };
})();

/* GET list of locations */
module.exports.locationsListByDistance = function(req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxDistance = parseFloat(req.query.maxDistance);
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxDistance),
    num: 10
  };
  if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
    console.log('locationsListByDistance missing params');
    sendJSONresponse(res, 404, {
      "message": "lng, lat and maxDistance query parameters are all required"
    });
    return;
  }

  callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      //console.log(str);
      var parsed = JSON.parse(str);
      list = parsed.results;
      var num_results = Math.min(list.length,5)
      locations = buildLocationList(req, res, list.slice(0,num_results));
      sendJSONresponse(res, 200, locations);

    });
  }

  var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=&'
          + 'location=' + lat + ',' + lng + '&radius=2000&type=restaurant&keyword=wifi';
  http.get(url, callback).end();
  

  var buildLocationList = function(req, res, results) {
    var locations = [];

    for(i=0;i<results.length;i++){
      locations.push({
        "name": results[i].name,
        "address": results[i].vicinity
      });
    };
    return locations;
  };


  /*
  Rnm.find().exec(function(err, results, stats) {
    var locations;
    if (err) {
      console.log('Error:', err);
      sendJSONresponse(res, 404, err);
    } else {
      locations = buildLocationList(req, res, results, stats);
      sendJSONresponse(res, 200, locations);
    }
  });
  */

/*
  Rnm.geoNear(point, geoOptions, function(err, results, stats) {
    var locations;
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    if (err) {
      console.log('geoNear error:', err);
      sendJSONresponse(res, 404, err);
    } else {
      var results = Rnm.db.collection('locations').find();
      locations = buildLocationList(req, res, results, stats);
      sendJSONresponse(res, 200, locations);
    }
  });
*/
};

/*
var buildLocationList = function(req, res, results, stats) {
  var locations = [];
  results.forEach(function(doc) {
    locations.push({
      //distance: theEarth.getDistanceFromRads(doc.dis),
      "name": doc.name,
      "address": doc.address,
      //rating: doc.rating,
      //facilities: doc.facilities,
      "_id": doc._id
    });
  });
  return locations;
};
*/

/* GET a location by the id */
module.exports.locationsReadOne = function(req, res) {
  console.log('Finding location details', req.params);
  if (req.params && req.params.locationid) {
    Rnm
      .findById(req.params.locationid)
      .exec(function(err, location) {
        if (!location) {
          sendJSONresponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(location);
        sendJSONresponse(res, 200, location);
      });
  } else {
    console.log('No locationid specified');
    sendJSONresponse(res, 404, {
      "message": "No locationid in request"
    });
  }
};

/* POST a new location */
/* /api/locations */
module.exports.locationsCreate = function(req, res) {
  console.log(req.body);
  Rnm.create({
    name: req.body.name,
    address: req.body.address,
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(location);
      sendJSONresponse(res, 201, location);
    }
  });
};
