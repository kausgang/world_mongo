var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE
  res.render('add_person');
});

module.exports = router;
