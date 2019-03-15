var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE

  // check if database connection is accessable
  // console.log(req.app.db);

  res.render('index', { title: 'Express' });
});

module.exports = router;
