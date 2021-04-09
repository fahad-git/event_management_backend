var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const dbHandler = require('./../dbHandler');

var authenticate = require('./../authenticate');


router.route('/event/:eventId')
.get(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        // console.log(rows)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.getEventVideos(req.params.eventId, callback);
});

router.route('/event/add')
.post(authenticate.verifyUser, (req, res, next) => {
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
    dbHandler.addEventVideo(req.body, callback);
});

router.route('/event/remove')
.delete(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        console.log(rows)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.removeEventVideo(req.body.video_Id, req.body.event_Id, req.user.user_Id, callback);
});


module.exports = router;