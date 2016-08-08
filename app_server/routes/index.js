var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/* GET home page. */
//router.get('/', ctrlMain.index);
router.get('/',ctrlLocations.list);
router.get('/location/:locationid',ctrlLocations.detail);
router.get('/location/:locationid/reviews/new',ctrlLocations.review);
router.post('/location/:locationid/reviews/new',ctrlLocations.addReview);
router.get('/about',ctrlOthers.about);

module.exports = router;
