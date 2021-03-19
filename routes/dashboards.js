var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const dbHandler = require('./../dbHandler');

var authenticate = require('./../authenticate');

const tmp = [{
    "id":1,
    "name":"Health Awareness",
    "date":"10-1-2021",
    "host":"Ali",
    "details":"This time of events is 4pm"
},{
    "id":2,
    "name":"Catwalk Show",
    "date":"10-1-2021",
    "host":"James",
    "details":"This time of events is 4pm"
},{
    "id":3,
    "name":"Games Theory",
    "date":"10-1-2021",
    "host":"Aqib",
    "details":"This time of events is 4pm"
}]

router.route('/user')
.get(authenticate.verifyUser, (req, res, next) => {
    let query = "select * from events"

    let returnObjecct  = {
        "totalOrganizeEvents":2,
        "totalAttendingEvents":4,
        "totalUpcomingEvents":104,
        "totalStalls":1,
        "notifications":[{
            "event":"catwalk",
            "details":"Event has been postpond"
        }],
        "organizingEvents":tmp,
        "attendingEvents":tmp,
        "myStalls":tmp
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(returnObjecct);


    // const callback = (err, rows, fields) => {
    //     if (err) {
    //       console.log(err)
    //       return;
    //     }
    //     // console.log(rows)
    //     // console.log(fields);
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(rows);
    // }
    // dbHandler.runGetQuery(query, callback);
})
module.exports = router;