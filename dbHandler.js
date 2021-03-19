var mysql = require('mysql')
const config = require('./config');
var connection = mysql.createConnection(config.sqlConfigurations)

connection.connect(function(err) {
  if (err) 
  {
    console.log(err);
    return;
  }
  console.log("Database Connected Successfully!");
});

exports.runGetQuery = function (query, callback){
    connection.query(query, callback);
};

exports.runInsertQuery = function (query, params, callback){
  connection.query(query, [params], callback);
};