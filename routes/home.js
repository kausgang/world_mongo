var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE
  res.redirect('/');
});

module.exports = router;
