const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

exports.questionIdSelect = async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM questions WHERE title = ?",
      [title]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: "User not found" });
    }
    console.log(rows[0].question_id);
    req.body.question_id = rows[0].question_id; // Set user_id in the request body
    connection.release();
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.AddAnswer = async (req, res) => {
  const { user_id, question_id, answer } = req.body;

  if (!answer) {
    return res.status(400).json({ msg: "Please provide information" });
  }

  try {
    const connection = await pool.getConnection();

    console.log(user_id);
    const sql =
      "INSERT INTO answers (user_id, question_id, answer) VALUES (?, ?, ?)";
    const [result] = await connection.execute(sql, [
      user_id,
      question_id,
      answer,
    ]);

    connection.release();

    res
      .status(201)
      .json({ id: result.insertId, message: "Answer delivered  successfully" });
  } catch (err) {
    console.error("Error delivering message:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};








exports.getAllAnswer = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
        users.user_id AS user_id, 
        users.email AS email, 
        questions.title AS question_title, 
        questions.description AS question_description,
        answers.answer AS answer
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id
        LEFT JOIN 
        answers ON users.user_id = answers.user_id`
    );
    connection.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
