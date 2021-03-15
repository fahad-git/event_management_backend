var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const runGetQuery = require('./../dbHandler');

var authenticate = require('./../authenticate');

router.route('/')
.get(authenticate.verifyUser, (req, res, next) => {
    let query = "select * from events"
    
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        // console.log(rows)
        // console.log(fields);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    runGetQuery(query, callback);
});

module.exports = router;