/* GET 'home' page */
module.exports.list = function(req, res){
  res.render('locations-list', { title: 'Home' });
};

/* GET 'Location info' page */
module.exports.detail = function(req, res){
  res.render('location-detail', { title: 'Location detail' });
};

/* GET 'Add review' page */
module.exports.review = function(req, res){
  res.render('location-review', { title: 'Add review' });
};