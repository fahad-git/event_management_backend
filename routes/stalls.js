var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const dbHandler = require('./../dbHandler');
var authenticate = require('./../authenticate');

router.route('/request')
.post(authenticate.verifyUser, (req, res, next) => {
    console.log(req.body);
    res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json([]);
    // const callback = (err, rows, fields) => {
    //     if (err) {
    //       console.log(err)
    //       return;
    //     }
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(rows);
    // }
    // dbHandler.getEventById(req.params.eventId, callback);
})

module.exports = router;