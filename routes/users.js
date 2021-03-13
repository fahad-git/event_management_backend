var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  next();
});

// module.exports = router;

// DB Connection
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ems'
})

connection.connect(function(err) {
  if (err) 
  {
    console.log(err);
    return;
  }
  console.log("Database Connected Successfully!");
});


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


router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


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

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;