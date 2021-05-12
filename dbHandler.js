var mysql = require('mysql')
const config = require('./config');
// var connection = mysql.createConnection(config.sqlConfigurations)

var connection;

// connection.connect(function(err) {
//   if (err) 
//   {
//     console.log(err);
//     return;
//   }
//   console.log("Database Connected Successfully!");
// });

function handleDisconnect() {
  connection = mysql.createConnection(config.sqlConfigurations); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }            
    console.log("Database Connected Successfully!");                         // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


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

exports.userProfileUpdate = function(userId, data, callback){
  let query = 'UPDATE `user` SET ? WHERE user_Id = ?';
  var res = connection.query(query, [data, userId], callback);
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
    // let query3 = "SELECT s.* FROM stall s, (SELECT * FROM `userrole` where user_Id = ?) u WHERE u.event_Id = s.event_Id AND u.status = 'Active' AND s.user_Id = ?"

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

exports.getStallIdFromEvent = function(eventId, userId, callback){
  let query = "SELECT stall_Id FROM `stall` where event_Id = ? AND user_Id = ?"
  connection.query(query, [eventId, userId], callback);

}

exports.getUpcomingEvents = function(user_Id, callback){
  // let query = 'SELECT e.* FROM `event` e, (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?) u where e.event_Id != u.event_Id';
  let query = "SELECT e.* FROM `event` e where e.event_Id NOT IN (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?)"
  connection.query(query, user_Id, callback);
}

exports.getRequestedEvents = function(user_Id, callback){
  // let query = 'SELECT e.* FROM `event` e, (SELECT DISTINCT event_Id FROM `userrole` where user_Id = ?) u where e.event_Id != u.event_Id';
  let query = "SELECT e.*, ur.status FROM `event` e, userrole ur where e.event_Id = ur.event_Id AND ur.status != 'Active'";
  connection.query(query, user_Id, callback);
}

exports.getAllEvents = function(callback){
  let query = 'SELECT * FROM `event` WHERE end_date >= curdate() ORDER BY start_date DESC';
  connection.query(query, callback);
}

exports.buyEventTicket = function(data, callback){
  let query = 'INSERT INTO userrole SET ?';
  connection.query(query, data, callback);
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

exports.getEventLobbyImages = function(eventId, callback){
  let query1 = "SELECT eventLobby_Id From event WHERE event_Id = ?"
  var res = connection.query(query1, [eventId], (err, rows, fields) => {
    if(err){
      console.log(err)
      return;
    }
    let eventLobbyId = rows[0]?.eventLobby_Id;
    let query = 'SELECT * FROM `eventlobby_images` WHERE eventLobby_Id = ?;';
    var res = connection.query(query, [eventLobbyId], callback);
  });
}

exports.setEventLobbyImages = function(eventId, data, callback){
  let query1 = "SELECT eventLobby_Id From event WHERE event_Id = ?"
  var res = connection.query(query1, [eventId], (err, rows, fields) => {
    if(err){
      console.log(err)
    }
    let eventLobbyId = rows[0]?.eventLobby_Id;
    let query = 'UPDATE `eventlobby_images` SET ? WHERE eventLobby_Id = ?;';
    var res = connection.query(query, [data, eventLobbyId], callback);
  });
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
  let query2 = "INSERT INTO `stall_images` (`stall_img_id`, `left_up_corner`, `left_bottom_corner`, `center_up`, `center_bottom`, `right_up_corner`, `right_bottom_corner`) VALUES (NULL, NULL, NULL, NULL, NULL, NULL, NULL);"
  connection.query(query2, (error, result) => {
    if (error) {
      console.log(error)
      return;
    }
    console.log(result.insertId);
    stallData["stall_img_id"] = result.insertId
    let query = 'INSERT INTO stall SET ?';
    connection.query(query, stallData, callback);  
  });
}

// this method explicitly add stall add by the organizer
// It takes two JSON objects 1 for stall table and other for userRole table
exports.explicitlyAddEventStall = function(stallData, callback){
  let query1 = 'INSERT INTO userrole SET ?';
  let query2 = 'INSERT INTO stall SET ?';
  connection.query(query1 + "; " + query2, [stallData.role, stallData.stall], callback);
}

exports.getEventStalls = function(eventId, callback){
  let query = "SELECT * FROM stall WHERE event_Id = ? AND status = 'Active'";
  connection.query(query, eventId, callback);
}

exports.blockStallFromEvent = function(stallId, callback){
  let query = "UPDATE `stall` SET `status` = 'Block' WHERE stall_Id = ?";
  connection.query(query, stallId, callback);
}

exports.stallByStallId = function(stallId, callback){
  let query = "SELECT * FROM stall WHERE stall_Id = ?";
  connection.query(query, stallId, callback);
}

exports.getStallEmail = function(stallId, callback){
  let query = "SELECT u.email FROM stall s, user u WHERE u.user_Id = s.user_Id AND s.stall_Id = ?";
  connection.query(query, stallId, callback);
}

exports.updateStallInfo = function(stallId, object, callback){
  let query = "UPDATE stall SET ? WHERE stall_Id = ?;";
  connection.query(query, [object, stallId], callback);
}

exports.getStallProducts = function(stallId, callback){
  let query = "SELECT * FROM `products` p, product_images pi Where pi.id = p.product_img_id AND p.stall_Id = ?";
  connection.query(query, [stallId], callback);
}


exports.addStallProduct = function(productData, callback){
  let query2 = "INSERT INTO `product_images` SET ?"
  connection.query(query2, [productData.imgs], (error, result) => {
    if (error) {
      console.log(error)
      return;
    }
    console.log(result.insertId);
    productData["product_img_id"] = result.insertId
    delete productData["imgs"];
    let query = 'INSERT INTO products SET ?';
    connection.query(query, productData, callback);  
  });
}


// Check If User is available
exports.checkUserAvailable = function(userId, callback){
  let query = 'SELECT name FROM user WHERE user_Id = ?';
  let sql = connection.query(query, userId, callback);
}

exports.checkStallOwner = function(stallId, userId, callback){
  let query = 'SELECT stall_Id FROM stall WHERE stall_Id = ? AND user_Id = ?';
  let sql = connection.query(query, [stallId, userId], callback);
  console.log(sql.sql)
}

exports.getStallImages = function(stallId, callback){
  let query = 'SELECT si.* FROM stall_images si, stall s WHERE si.stall_img_id = s.stall_img_id and s.stall_Id = ?';
  let sql = connection.query(query, [stallId], callback);
}

exports.setStallImage = function(stallId, data, callback){
  let query = 'UPDATE `stall_images` si, stall s SET ? WHERE si.stall_img_id = s.stall_img_id AND s.stall_Id = ?';
  let sql = connection.query(query, [data, stallId], callback);
}

// check Username
exports.checkUsernameAvailable = function(username, callback){
  let query = 'SELECT * FROM user WHERE ?';
  let sql = connection.query(query, username, callback);
}

// No longer used!
exports.runGetQuery = function (query, callclback){
  connection.query(query, callback);
};

exports.runInsertQuery = function (query, params, callback){
connection.query(query, [params], callback);
};