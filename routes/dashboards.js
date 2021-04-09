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

router.route('/user/:userId')
.get(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        // Result Sequence
        // rows[0] : All events in which user is a Visitor
        // rows[1] : All events in which user is an Organizer or OrgAsst
        // rows[2] : All events in which user is an Exhibitor
        // rows[3] : All events notification to which user is associated
        // rows[4] : All the events to which user is not associated by any mean/Upcoming events
        
        
        let dashboardData  = {
        "totalAttendingEvents": rows[0].length,
        "totalOrganizeEvents": rows[1].length,
        "totalStalls": rows[2].length,
        "totalUpcomingEvents":rows[4].length,

        "attendingEvents": rows[0],
        "organizingEvents": rows[1],
        "myStalls": rows[2],
        "notifications": rows[3],
        "upcomingEvents": rows[4]
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dashboardData);
    }
    dbHandler.getUserDashboardData(req.params.userId, callback);
})
module.exports = router;