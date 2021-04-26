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

exports.registerUser = function(user, callback){
  // (name, email, username, userType, password, phone, address)
  let query = 'INSERT INTO user SET ?';
  connection.query(query, user, callback);
}

exports.loginUser = function(username, callback){
  let query = 'SELECT ?? FROM ?? WHERE username = ? LIMIT 1';
  let columns = ['user_Id', 'name', 'email', 'username', 'userType', 'password', 'phone', 'address'];
  var res = connection.query(query, [columns, 'user', username], callback);
  // console.log(res.sql);
}

// this function will return user dashboard data
exports.getUserDashboardData = function(user_Id, callback){
    //  select all events with event_id and user_id
    // let query1 = 'SELECT * FROM `event` e, (SELECT * FROM `userrole` where user_Id = ?) u where e.event_Id = u.event_Id andstart_date >= curdate();';
    //  select all events with event_id and user_id whose user is visitor
    let query1 = "SELECT e.* FROM `event` e, (SELECT * FROM `userrole` where user_Id = ?) u where e.event_Id = u.event_Id and e.end_date >= curdate() and role_Id = 7 and u.status = 'Active';"

    //  select all events with event_id and user_id whose user is organizer
    let query2 = "SELECT e.* FROM `event` e, (SELECT * FROM `userrole` where user_Id = ?) u where e.event_Id = u.event_Id and e.end_date >= curdate() and (role_Id = 4 or role_Id = 5) and u.status = 'Active';"

    //  select all events with event_id and user_id whose user is exhibitor/Stalls
    let query3 = "SELECT e.* FROM `event` e, (SELECT * FROM `userrole` where user_Id = ?) u where e.event_Id = u.event_Id and e.end_date >= curdate() and role_Id = 6 and u.status = 'Active';"
    
    // Select all notifications
    let query4 = "SELECT * FROM `notification` where user_id = ? and date >= curdate();";
    //  getting all events that does not belong to a perticular user ie upcomig events
    // let query5 = 'SELECT e.* FROM `event` e, (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?) u where e.event_Id != u.event_Id and e.start_date >= curdate()';
    let query5 = 'SELECT e.* FROM `event` e where e.event_Id NOT IN (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?) and e.end_date >= curdate()'
    var res = connection.query(query1 + " " + query2 + " " + query3 + " " + query4 + " " + query5, [user_Id, user_Id, user_Id, user_Id, user_Id], callback);
    // console.log(res.sql);
    // Result Sequence
    // rows[0] : All events in which user is a Visitor
    // rows[1] : All events in which user is an Organizer or OrgAsst
    // rows[2] : All events in which user is an Exhibitor
    // rows[3] : All events notification to which user is associated
    // rows[4] : All the events to which user is not associated by any mean/Upcoming events
}

exports.getUpcomingEvents = function(user_Id, callback){
  // let query = 'SELECT e.* FROM `event` e, (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?) u where e.event_Id != u.event_Id';
  let query = 'SELECT e.* FROM `event` e where e.event_Id NOT IN (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?)'
  connection.query(query, user_Id, callback);
}

exports.getAllEvents = function(callback){
  let query = 'SELECT * FROM `event` WHERE end_date >= curdate() ORDER BY start_date DESC';
  connection.query(query, callback);
}

exports.getOrganizingEventsByUserID = function(user_Id, callback){
    //  select all events with event_id and user_id whose user is organizer
  let query = "SELECT e.* FROM `event` e, (SELECT * FROM `userrole` where user_Id = ?) u where e.event_Id = u.event_Id and (role_Id = 4 or role_Id = 5) and u.status = 'Active';"
  connection.query(query, user_Id, callback);
}

exports.getEventById = function(eventId, callback){
  let query = 'SELECT * FROM `event` WHERE event_Id = ? LIMIT 1';
  connection.query(query, eventId, callback);
}

exports.getEventLobbyControls = function(eventId, userId, callback){
  let query1 = 'SELECT el.* FROM eventlobby el, event e WHERE e.eventlobby_Id = el.eventlobby_Id AND e.event_Id = ?;'
  let query2 = "SELECT COUNT(*) > 0 as organizer FROM userrole where event_Id = ? and user_Id = ? and (role_Id = 4 or role_Id = 5)"
  var res = connection.query(query1 + " " + query2, [eventId, eventId, userId], callback);
}

exports.updateEventLobbyControls = function(eventLobbyId, col, val, callback){
  let query = 'UPDATE `eventlobby` SET '+col+' = ? WHERE eventLobby_Id = ?;';
  var res = connection.query(query, [val, eventLobbyId], callback);
  console.log(res.sql);
}

//  Video APIs queries

exports.getEventVideos = function(eventId, callback){
  let query = "SELECT * FROM videos WHERE event_Id = ? ORDER BY video_Id DESC";
  var res = connection.query(query, eventId, callback);
}

exports.addEventVideo = function(videoData, callback){
  let query = 'INSERT INTO videos SET ?';
  connection.query(query, videoData, callback);
}

exports.removeEventVideo = function(videoId, eventId, userId, callback){
  let query = "SELECT role_Id FROM userrole WHERE event_Id = ? AND user_Id =?";
  connection.query(query, [eventId, userId], (err, rows, fields) => {
      // console.log(rows)
        if (err) {
          console.log(err)
          callback(err, rows, fields);
          return;
        } else if(!rows){
          callback(err, rows, fields);
          return;
        }
        else if(!(rows[0].role_Id === 4 || rows[0].role_Id === 5)){
          callback(err, rows, fields);
          return;
        }
      let query = 'DELETE FROM videos WHERE video_Id = ?';
      connection.query(query, videoId, callback);
    });
}

// Webinar APIs queries

exports.getEventWebinars = function(eventId, callback){
  let query = "SELECT * FROM links WHERE event_Id = ? ORDER BY link_Id DESC";
  var res = connection.query(query, eventId, callback);
}

exports.addEventWebinar = function(webinarData, callback){
  let query = 'INSERT INTO links SET ?';
  connection.query(query, webinarData, callback);
}

exports.removeEventWebinar = function(linkId, eventId, userId, callback){
  let query = "SELECT role_Id FROM userrole WHERE event_Id = ? AND user_Id =?";
  connection.query(query, [eventId, userId], (err, rows, fields) => {
      // console.log(rows)
        if (err) {
          console.log(err)
          callback(err, rows, fields);
          return;
        } else if(!rows){
          callback(err, rows, fields);
          return;
        }
        else if(!(rows[0].role_Id === 4 || rows[0].role_Id === 5)){
          callback(err, rows, fields);
          return;
        }
      let query = 'DELETE FROM links WHERE link_Id = ?';
      connection.query(query, linkId, callback);
    });
}

// Categories
exports.getCategories = function(type, callback){
  let query = "SELECT * FROM categories WHERE type = ?";
  var res = connection.query(query, type, callback);
}


// Stall APIs queries
exports.addEventStall = function(stallData, callback){
  let query = 'INSERT INTO stall SET ?';
  connection.query(query, stallData, callback);
}

exports.getEventStalls = function(eventId, callback){
  let query = 'SELECT * FROM stall WHERE event_Id = ?';
  connection.query(query, eventId, callback);
}

// No longer used!
exports.runGetQuery = function (query, callclback){
  connection.query(query, callback);
};

exports.runInsertQuery = function (query, params, callback){
connection.query(query, [params], callback);
};