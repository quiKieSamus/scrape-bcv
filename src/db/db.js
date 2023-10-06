const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "genionet_licenciamiento_ruben_pasante_jefe"
});

module.exports = connection;