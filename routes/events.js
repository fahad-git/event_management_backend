var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const dbHandler = require('./../dbHandler');

var authenticate = require('./../authenticate');

var emailServer = require('./email');
const email = require('../emailModule');

// const tmp = [{
//     "id":1,
//     "name":"Exams Sites",
//     "date":"10-1-2021",
//     "host":"Mark",
//     "details":"This event is about mannaging your events"
// },{
//     "id":2,
//     "name":"Health Awareness",
//     "date":"10-1-2021",
//     "host":"Ali",
//     "details":"This time of events is 4pm"
// },{
//     "id":3,
//     "name":"Catwalk Show",
//     "date":"10-1-2021",
//     "host":"James",
//     "details":"This time of events is 4pm"
// },{
//     "id":4,
//     "name":"Games Theory",
//     "date":"10-1-2021",
//     "host":"Aqib",
//     "details":"This time of events is 4pm"
// }]

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

router.route('/ticket/:eventId')
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
    let data = {
        "role_Id":7, //visitor
        "event_Id": req.params.eventId,
        "user_Id": req.user.user_Id,
        "status":"Pending"
    }
    dbHandler.buyEventTicket(data, callback);
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
    dbHandler.getUpcomingEvents(callback);
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
    dbHandler.getAllEvents(req.params.userId, callback);
});


router.route('/user/requested/:user_Id')
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
    dbHandler.getRequestedEvents(req.params.user_Id, callback);
});

router.route('/admin')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.getUpcomingEventsByAdmin(callback);
});


router.route('/admin/:roleId')
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.updateUpcomingEventsByAdmin(req.body, req.params.roleId, callback);
});

// Organizer APIs

router.route('/organizer')
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
    dbHandler.getUpcomingEventsByOrganizer(callback);
});


router.route('/organizer/:roleId')
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
    dbHandler.updateUpcomingEventsByOrganizer(req.body, req.params.roleId, callback);
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



router.route('/email')
.post(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        if(!rows[0])
        {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.json("Can not send message");
          return;
        }
        var mailInfo = req.body;
        mailInfo["to"] = rows[0].email;

        email.sendEmail(mailInfo,  (error, result) => {
          if (error) {
            console.log(error)
            return;
          }
  
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);
        })
    }
    dbHandler.getOrganizerEmail(req.body.event_Id, callback);
})



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
    const callback = (err, rows, fields) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    }
    dbHandler.addNewEvent(req.body, req.user.user_Id, callback);
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


router.route('/user/images/:eventId')
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
        dbHandler.getEventLobbyImages(req.params.eventId, callback);
});


router.route('/user/images/:eventId')
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
        dbHandler.setEventLobbyImages(req.params.eventId, req.body, callback);
});



router.route('/user/chat')
.post(authenticate.verifyUser, (req, res, next) => {
    const response = emailServer.sendMail(req.body.to, req.body.subject, req.body.body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
});

router.route('/stall/:eventId')
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
    dbHandler.getStallIdFromEvent(req.params.eventId, req.user.user_Id, callback);
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