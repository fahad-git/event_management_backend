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


const runGetQuery = (query, callback) => {
    connection.query(query, callback);
}

module.exports = runGetQuery;