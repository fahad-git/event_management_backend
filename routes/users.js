var passport = require('passport');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

var authenticate = require('./../authenticate');

const dbHandler = require('./../dbHandler');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

router.post('/signup', (req, res, next) => {
  // const name = req.body.name;
  // const email = req.body.email;
  // const userType = req.body.userType;
  // const username = req.body.username;
  // const password = req.body.password;
  // const phone = req.body.phone;
  // const address = req.body.address;

  // let query = "INSERT INTO user (name, email, username, userType, password, phone, address) VALUES ?";
  // let values = [
  //   [name, email, username, userType, password, phone, address]
  // ]

  const callback = (err, result) => {
    if(err) {
      console.log("Error")
      if(err.code === "ER_DUP_ENTRY"){
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Registration Failed', err:"User already exist"});
      }else{
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Registration Failed', err: err});
      }
    }
    else {
      // passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      // });
    }
  }

  console.log(req.body);
  // dbHandler.runInsertQuery(query, values, callback);
  dbHandler.registerUser(req.body, callback);
});
router.post('/check-username',  (req, res) => {
    // query = "select * from user where username = '" + req.body.username + "';";
    // console.log(req.body);
    // console.log(query)
    const callback = (err, rows, fields) => {
      if(err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Username validation failed', err:"Username already exist"});
      }else if(rows.length > 0){
        res.statusCode = 409;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Username Not Available', err:"Username already exist"});
      }else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Username available'});
      }
    }

    dbHandler.checkUsernameAvailable(req.body, callback);
});


router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: false,  message: 'Error in database', err:err});
    }
    if(!user) { 
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({success: false,  message: info.message});
    }

    // const user = req.user;
    delete user["password"];
    var token = authenticate.getToken({username: user.username});
    user["token"] = token;
    user.tokenExpiry = 3600;
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.json({success: true, user: user, message: 'You are successfully logged in!'});
  })(req, res);
});


router.get('/token', authenticate.verifyUser, (req, res) => {
  const user = req.user;
  var token = authenticate.getToken({username: req.user.username});
  user["token"] = token;
  user.tokenExpiry = 3600;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, user: user, status: 'Your session has refreshed'});
});

router.get('/logout', authenticate.verifyUser, (req, res, next) => {
  if (req.user) {
    // req.session.destroy();
    // res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.route('/user/profile')
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
    dbHandler.userProfileUpdate(req.user.user_Id, req.body, callback);
});



module.exports = router;



// module.exports = router;

// DB Connection

// var mysql = require('mysql')
// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'ems'
// })

// connection.connect(function(err) {
//   if (err) 
//   {
//     console.log(err);
//     return;
//   }
//   console.log("Database Connected Successfully!");
// });


// router.post('/signup', (req, res, next) => {
  
//   conn.query(query, function (err, rows, fields) {
//     if (err) {
//       console.log(err)
//       return;
//     }
//     // console.log(rows)
//     // console.log(fields);
//     return rows
//   })
//     .then((user) => {
//     if(user != null) {
//       var err = new Error('User ' + req.body.username + ' already exists!');
//       err.status = 403;
//       next(err);
//     }
//     else {
//       return User.create({
//         username: req.body.username,
//         password: req.body.password});
//     }
//   })
//   .then((user) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     res.json({status: 'Registration Successful!', user: user});
//   }, (err) => next(err))
//   .catch((err) => next(err));
// });

/*

router.post('/login', (req, res, next) => {
  console.log(req.headers)
  if(!req.session.user) {
    var authHeader = req.headers.authorization;
    
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0].toString().trim();
    var password = auth[1].toString().trim();
    
    if(username === '' || password === ''){
      var err = new Error('Empty username or password!');
      err.status = 403;
      return next(err);
    }

    let query = "SELECT * FROM login WHERE username = '" + username +"' LIMIT 1";
    console.log(query)
    connection.query(query, function (err, user, fields) {
      if (err) {
        console.log(err)
        return;
      }

      user = user[0];

      if(user === null){
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }

    })//query ends
    
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

*/
