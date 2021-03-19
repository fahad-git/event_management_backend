const cors = require('cors');
var config = require('./../config.js');

const whitelist = config.allowedOrigins;
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    // console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);