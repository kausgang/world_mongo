var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE
  res.render('add_event');
});

module.exports = router;
