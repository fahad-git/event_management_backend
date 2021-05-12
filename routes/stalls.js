var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json({limit: '50mb'}));

const dbHandler = require('./../dbHandler');
var authenticate = require('./../authenticate');
const email = require('../emailModule');


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
    req.body["user_Id"] = req.user.user_Id;
    dbHandler.addEventStall(req.body, callback);
})


router.route('/users/:userId')
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
    dbHandler.checkUserAvailable(req.params.userId, callback);
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


router.route('/event/add')
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
    dbHandler.explicitlyAddEventStall(req.body, callback);
})

router.route('/block/:stallId')
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
    dbHandler.blockStallFromEvent(req.params.stallId, callback);
})

router.route('/stall/:stallId')
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
    dbHandler.stallByStallId(req.params.stallId, callback);
})

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
    dbHandler.getStallEmail(req.body.stall_Id, callback);
})

router.route('/update/:stallId')
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
    dbHandler.updateStallInfo(req.params.stallId, req.body, callback);
})

router.route('/owner/:stallId')
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
    dbHandler.checkStallOwner(req.params.stallId, req.user.user_Id, callback);
})


router.route('/stall/images/:stallId')
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
    dbHandler.getStallImages(req.params.stallId, callback);
})

router.route('/stall/images/:stallId')
.put(authenticate.verifyUser, (req, res, next) => {
    const callback = (err, result) => {
        if (err) {
          console.log(err)
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }
    dbHandler.setStallImage(req.params.stallId, req.body, callback);
})

router.route('/stall/products/:stallId')
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
    dbHandler.getStallProducts(req.params.stallId, callback);
})

router.route('/stall/products')
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
    dbHandler.addStallProduct(req.body, callback);
})



module.exports = router;