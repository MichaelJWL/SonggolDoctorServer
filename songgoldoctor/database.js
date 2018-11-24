
var mysql      = require('mysql');
var connection = mysql.createConnection({
host     : 'localhost',
user     : 'songgoldoctor',
password : '1q2w3e4r',
port     : 3306,
database : 'SonggolDoctor'
});

connection.connect();

module.exports = connection;