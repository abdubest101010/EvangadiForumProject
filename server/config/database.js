const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});
const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL,
  firstName VARCHAR(25) NOT NULL,
  lastName VARCHAR(25) NOT NULL,
  password VARCHAR(100) NOT NULL
)`;
const createQuestionTable = `
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  tag VARCHAR(25),
  INDEX (user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)`;
const createAnswerTable = `
CREATE TABLE IF NOT EXISTS answers (
  answer_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  answer VARCHAR(255) NOT NULL,
  INDEX (user_id),
  INDEX (question_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (question_id) REFERENCES questions(question_id)
)`;

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error getting connection from pool:", err.stack);
    return;
  }

  connection.query(createUserTable, (err, results, fields) => {
    connection.release();

    if (err) {
      console.error("Error creating user table:", err.stack);
      return;
    }
    console.log("User Table created successfully.");
  });
  connection.query(createQuestionTable, (err, results, fields) => {
    connection.release();

    if (err) {
      console.error("Error creating Question table:", err.stack);
      return;
    }
    console.log("Question Table created successfully.");
  });
  connection.query(createAnswerTable, (err, results, fields) => {
    connection.release();

    if (err) {
      console.error("Error creating Answer table:", err.stack);
      return;
    }
    console.log("Answer Table created successfully.");
  });
});

module.exports = pool.promise();
