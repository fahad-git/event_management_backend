var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('./routes/cors');

var logger = require('morgan');


var passport = require('passport');
var authenticate = require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');
var dashboardsRouter = require('./routes/dashboards');
var stallsRouter = require('./routes/stalls');
var videosRouter = require('./routes/videos');
var webinarRouter = require('./routes/webinars');

var app = express();
// var cons = require('consolidate');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.engine('html', cons.swig)
// app.set('views', path.join(__dirname, 'build'));
// app.set('view engine', 'html');


//cross origin resource sharing (CORS) implementation
app.options('/', cors.corsWithOptions);
app.use(cors.corsWithOptions);
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false }));


app.use(passport.initialize());
// app.use(passport.session());

// app.use(auth);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventsRouter);
app.use('/dashboards', dashboardsRouter);
app.use('/stalls', stallsRouter);
app.use('/videos', videosRouter);
app.use('/webinars', webinarRouter);

/* This should be uncomment in production */

const root = require('path').join(__dirname, 'public', 'build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var FileStore = require('session-file-store')(session);
// const { signedCookie } = require('cookie-parser');

// THE Secret key will be user by cookie parser to encrypt cookies
// app.use(cookieParser("12345-67890-09876-54321"));


// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));


// Authorization

// function auth(req, res, next){
//   // console.log(req.headers);
//   // console.log(req.signedCookies);

//   // if(!req.signedCookies.user){
    
//   if(!req.session.user){
//     var authHeader = req.headers.authorization;
    
  
//     if(!authHeader){
//       var err = new Error('You are not authenticated!');
      
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);  
//     }

//     var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     var username = auth[0];
//     var password = auth[1];
//     let record = login(connection, 'SELECT * FROM login WHERE id = 2');
//     console.log("Record:");
//     console.log(record);
//     if(username === 'admin' && password === '123'){
//       // res.cookie("user", 'admin', { signed: true })
//       req.session.user = 'admin';
//       next();
//     }else{
//       var err = new Error('You are not authenticated!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
  
//   }else{
//     // if(req.signedCookies.user === 'admin'){
      
//     if(req.session.user === 'admin'){
//       next();
//     }else{
//       var err = new Error('You are not authenticated!');
  
//       res.setHeader('WWW-Authenticate', 'Basic');
//       err.status = 401;
//       return next(err);
//     }
//   }


// }

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

// connection.end()

// const login = (conn, query) => {
//   try{
//   // conn.connect()

//   conn.query(query, function (err, rows, fields) {
//       if (err) {
//         console.log(err)
//         return;
//       }
//       // console.log(rows)s
//       // console.log(fields);
//       return rows
//     })

//   // conn.end()
//   }
//   catch(e){
//     console.log(e);
//   }
// }
