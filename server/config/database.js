const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  max: 10, // Connection limit
});

const createUserTable = `
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(20) NOT NULL,
  email VARCHAR(40) NOT NULL,
  firstName VARCHAR(25) NOT NULL,
  lastName VARCHAR(25) NOT NULL,
  password VARCHAR(100) NOT NULL
)`;

const createQuestionTable = `
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  question_id VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  tag VARCHAR(25),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
)`;

const createAnswerTable = `
CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  question_id VARCHAR(100) NOT NULL,
  answer VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (question_id) REFERENCES questions(question_id)
)`;

async function createTables() {
  const client = await pool.connect();

  try {
    await client.query(createUserTable);
    console.log("User Table created successfully.");

    await client.query(createQuestionTable);
    console.log("Question Table created successfully.");

    await client.query(createAnswerTable);
    console.log("Answer Table created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err.stack);
  } finally {
    client.release();
  }
}

createTables().catch((err) =>
  console.error("Error during table creation:", err.stack)
);

module.exports = pool;
