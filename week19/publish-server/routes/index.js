var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path')

/* GET home page. */
router.post('/', function(req, res, next) {
  const filepath = path.resolve(__dirname, '../../server/public', req.query.filename)
  fs.writeFileSync(filepath, req.body.content)
  res.send('OK');
});

module.exports = router;