var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/* GET home page. */
//router.get('/', ctrlMain.index);
router.get('/',ctrlLocations.list);
router.get('/location',ctrlLocations.detail);
router.get('/location/review/new',ctrlLocations.review);
router.get('/about',ctrlOthers.about);

module.exports = router;
