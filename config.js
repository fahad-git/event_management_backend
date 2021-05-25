/*
module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'allowedOrigins':['http://localhost:3000', 'https://localhost:3443', 
    'http://localhost:5000', 'http://192.168.1.100:3000',  'http://192.168.1.103:3000'],
    'sqlConfigurations' : {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ems_db',
        multipleStatements: true
      },
}
*/

module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'allowedOrigins':['http://localhost:3000', 'https://localhost:3443', 'http://localhost:5000', 'http://192.168.1.100:3000',  'http://192.168.1.105:3000', 'http://3.137.205.27:3000'],
  'sqlConfigurations' : {
      host: 'ems-database.czq7a26zc6o2.eu-west-2.rds.amazonaws.com',
      user: 'root',
      password: 'PerfektEMS',
      database: 'ems',
      port:3306,
      multipleStatements: true
    },
}
