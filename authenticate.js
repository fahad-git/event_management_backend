var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

const runGetQuery = require('./dbHandler');

const authenticationFunction = (username, password, done) => {

    // const query = "select * from login where username = '" + username + "' and password = '" + password + "'";
    const query = "SELECT login.id, login.user_id, login.username, login.role, users.name, users.phone, users.address"
                + " FROM login, users "
                + "WHERE login.user_id = users.id and login.username = '" + username + "' and login.password = '" + password + "'";

    const callback = (err, rows, fields) => {
        if(rows === [])
            return done(null, false);
        const user = rows[0];
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    runGetQuery(query, callback);
}

exports.local =  passport.use(new LocalStrategy(authenticationFunction));
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);

        let query = "SELECT * FROM login WHERE id = " + jwt_payload.id;

        const callback = (err, rows) => {
            const user = rows[0]
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }

        runGetQuery(query, callback);
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});