var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'robot',
    password: '123456',
    database: 'manageSystem'
})
module.exports = connection