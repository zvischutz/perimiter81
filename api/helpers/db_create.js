const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(process.env.PWD + '/pizza-delivery.db');
const testdb = new sqlite3.Database(process.env.PWD + '/pizza-delivery-test.db');

db.serialize(function() {
  /*db.run("DROP TABLE pizza_user;");
  testdb.run("DROP TABLE pizza_user;");*/
  db.run("CREATE TABLE pizza_user (id INT PRIMARY KEY, name VARCHAR(100), email_address VARCHAR(255) unique, street_address VARCHAR(1000), username VARCHAR(100) unique, hashed_password VARCHAR(255) );");
  testdb.run("CREATE TABLE pizza_user (id INT PRIMARY KEY, name VARCHAR(100), email_address VARCHAR(255) unique, street_address VARCHAR(1000), username VARCHAR(100) unique, hashed_password VARCHAR(255) );");
  /*db.run("DROP TABLE pizza_cart;");
  testdb.run("DROP TABLE pizza_cart;");*/
  db.run("CREATE TABLE pizza_cart (id INT PRIMARY KEY, userId INT, productName VARCHAR(255), quantity INT, amount FLOAT );");
  testdb.run("CREATE TABLE pizza_cart (id INT PRIMARY KEY, userId INT, productName VARCHAR(255), quantity INT, amount FLOAT  );");
  /*db.run("DROP TABLE pizza_order;");
  testdb.run("DROP TABLE pizza_order;");*/
  db.run("CREATE TABLE pizza_order (id INT PRIMARY KEY, userId INT, productName VARCHAR(255), quantity INT, amount FLOAT );");
  testdb.run("CREATE TABLE pizza_order (id INT PRIMARY KEY, userId INT, productName VARCHAR(255), quantity INT, amount FLOAT  );");
});

db.close();

