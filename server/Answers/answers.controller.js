const pool = require("../config/database");

exports.AddAnswer = async (req, res) => {
  const { question_id, answer } = req.body;
  const { user_id } = req.user;
  if (!answer || !question_id) {
    return res.status(400).json({ msg: "Please provide information" });
  }
  try {
    const connection = await pool.getConnection();
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

exports.updateAnswer = async (req, res) => {
  const { answer } = req.body;
  const answer_id = req.params.answer_id;
  if (!answer_id || !answer) {
    return res.status(400).send({ error: "Answer ID and answer are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    const [updateAnswers] = await connection.execute(
      "UPDATE answers SET answer = ? WHERE answer_id = ?",
      [answer, answer_id]
    );

    if (updateAnswers.affectedRows === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    res.send({ message: "Answer updated successfully" });
  } catch (err) {
    console.error("Error updating answer:", err.message);
    res.status(500).json({ error: "Database update failed" });
  } finally {
    if (connection) connection.release();
  }
};

exports.getAllAnswers = async (req, res) => {
  let connection;
  console.log("Endpoint hit"); // Log when the endpoint is hit
  try {
    connection = await pool.getConnection();
    console.log("Database connection established"); // Log when the connection is established

    const [rows] = await connection.execute(
      `SELECT 
        users.user_id AS user_id,  
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

    console.log("Query executed successfully, results:", rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) {
      connection.release();
      console.log("Database connection released"); // Log when the connection is released
    }
  }
};

exports.UserAnswer = async (req, res) => {
  const { user_id } = req.user;
  console.log("Fetching answers for user_id:", user_id);

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
        users.user_id,
        users.username AS username,
        questions.question_id AS question_id,
        questions.title AS question_title,
        answers.answer_id,
        answers.answer AS answer
      FROM 
        questions
      JOIN 
        users ON questions.user_id = users.user_id
      LEFT JOIN 
        answers ON questions.question_id = answers.question_id
      WHERE 
        users.user_id = ? AND answers.answer_id IS NOT NULL
      ORDER BY 
        questions.question_id DESC`,
      [user_id]
    );

    console.log("Query Result:", rows);

    connection.release();

    if (rows.length === 0) {
      console.log("No answers found for user_id:", user_id);
      return res.status(404).json({ error: "Answers not found" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching answers:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getTitlesWithAnswers = async (req, res) => {
  const { user_id } = req.user;

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
        questions.question_id,
        questions.title AS question_title,
        answers.answer_id,
        answers.answer AS answer
      FROM 
        questions 
      LEFT JOIN 
        answers  ON questions.question_id = answers.question_id AND answers.user_id = ?
      WHERE 
        questions.user_id = ? AND answers.answer_id IS NOT NULL
      ORDER BY 
        answers.answer_id DESC`,
      [user_id, user_id]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Titles with answers not found" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching titles with answers:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAnswer = async (req, res) => {
  const { answer_id } = req.body;

  if (!answer_id) {
    return res.status(400).json({ error: "Question ID is required" });
  }

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      "DELETE FROM answers WHERE answer_id = ?",
      [answer_id]
    );

    await connection.commit();
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    res.json({ message: "Answer  deleted successfully" });
  } catch (err) {
    console.error("Error deleting answer:", err.message);
    res.status(500).json({ error: "Database deletion failed" });
  }
};

exports.singleAnswerId = async (req, res) => {
  const answer_id = req.params.answer_id;

  try {
    // Fetch answer details using answer_id
    const [answerRows] = await pool.execute(
      `SELECT 
        answers.answer_id,
        answers.question_id,
        answers.answer,
        questions.title AS question_title
      FROM answers
      LEFT JOIN questions ON answers.question_id = questions.question_id
      WHERE answers.answer_id = ?
      ORDER BY answers.answer_id DESC`,
      [answer_id]
    );

    if (answerRows.length === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const answer = {
      answer_id: answerRows[0].answer_id,
      question_id: answerRows[0].question_id,
      question_title: answerRows[0].question_title,
      answer: answerRows[0].answer,
    };

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error fetching answer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
