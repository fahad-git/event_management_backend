var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const dbHandler = require('./../dbHandler');
var authenticate = require('./../authenticate');


router.route('/categories')
.get(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.getCategories('Stall', callback);
})

router.route('/request')
.post(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.addEventStall(req.body, callback);
})


router.route('/event/:eventId')
.get(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.getEventStalls(req.params.eventId, callback);
})
module.exports = router;