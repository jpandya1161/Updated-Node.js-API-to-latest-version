const mysql = require("mysql2");
require("./Global");

const server = {
  mc_superadmin: mysql.createConnection({
    //change
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database : 'simplyloose_superadmin',
    connectTimeout: 60000,
  }),

  mc_subdomain: mysql.createConnection({
    //change
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database : "simplyloose_sldemo",
    connectTimeout: 60000,
  }),
};

server.mc_superadmin.connect(function (err) {
  if (err) {
    console.error("Error connecting to superadmin database: " + err.stack);
    return;
  }
  console.log(
    "Connected to superadmin database as id " + server.mc_superadmin.threadId
  );
});

if (global.subdomain != "") {
  server.mc_subdomain.connect(function (err) {
    if (err) {
      console.error("Error connecting to subdomain database: " + err.stack);
      return;
    }
    console.log(
      "Connected to subdomain database as id " + server.mc_subdomain.threadId
    );
  });
}

module.exports = server;
