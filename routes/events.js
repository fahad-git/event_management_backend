var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const dbHandler = require('./../dbHandler');

var authenticate = require('./../authenticate');

var emailServer = require('./email')

const tmp = [{
    "id":1,
    "name":"Exams Sites",
    "date":"10-1-2021",
    "host":"Mark",
    "details":"This event is about mannaging your events"
},{
    "id":2,
    "name":"Health Awareness",
    "date":"10-1-2021",
    "host":"Ali",
    "details":"This time of events is 4pm"
},{
    "id":3,
    "name":"Catwalk Show",
    "date":"10-1-2021",
    "host":"James",
    "details":"This time of events is 4pm"
},{
    "id":4,
    "name":"Games Theory",
    "date":"10-1-2021",
    "host":"Aqib",
    "details":"This time of events is 4pm"
}]

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
    dbHandler.getCategories('Event', callback);
})


router.route('/user')
.get((req, res, next) => {
    // let query = "select * from events"

    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json');
    // res.json(tmp);
    
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
    dbHandler.getAllEvents(callback);
});

router.route('/user/:userId')
.get((req, res, next) => {
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
    dbHandler.getUpcomingEvents(req.params.userId, callback);
});

router.route('/user/organizing/:userId')
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
    dbHandler.getOrganizingEventsByUserID(req.params.userId, callback);
});

router.route('/details/:eventId')
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
    dbHandler.getEventById(req.params.eventId, callback);
});

router.route('/user/request')
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

router.route('/user/options/:eventId')
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
        dbHandler.getEventLobbyControls(req.params.eventId, req.user.user_Id, callback);
});

router.route('/user/options/:eventLobbyId')
.put(authenticate.verifyUser, (req, res, next) => {
        const callback = (err, rows, fields) => {            
            if (err) {
              console.log(err)
              return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(rows);
        }
        dbHandler.updateEventLobbyControls(req.params.eventLobbyId, req.body.col, req.body.value, callback);
});


router.route('/user/chat')
.post(authenticate.verifyUser, (req, res, next) => {
    const response = emailServer.sendMail(req.body.to, req.body.subject, req.body.body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

router.route('/admin')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // let query = "select * from events"
    
    // const callback = (err, rows, fields) => {
    //     if (err) {
    //       console.log(err)
    //       return;
    //     }
        // console.log(rows)
        // console.log(fields);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json([]);
    // }
    // runGetQuery(query, callback);
});



module.exports = router;


//     obj = {
        //     1: {
        //         "event" : {
        //         "Catwalk":"Catwalk",
        //         "HelpDesk":"HelpDesk",
        //         "Exhibitors":"Exhibitors",
        //         "Webinar":"Webinar"
        //         },
        //         "role":"host"
        //     },
        //     2: {
        //         "event":{
        //         "Catwalk":"Fashion Show",
        //         "HelpDesk":null,
        //         "Exhibitors":"Exhibitors",
        //         "Webinar":"Webinar"
        //         },
        //         "role":"organizer"
        //     },
        //     3: {
        //         "event":{
        //         "Catwalk":"Catwalk",
        //         "HelpDesk":"HelpDesk",
        //         "Exhibitors":"Shops",
        //         "Webinar":null
        //         },
        //         "role":"attendee"
        //     }

        // } 