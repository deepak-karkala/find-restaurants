module.exports.about = function(req,res) {
  res.render('about', { 
  	title: 'About',
  	content: 'Restaurants Near Me helps you to find restaurants in your nearby locations.'
  });
};