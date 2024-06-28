const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

exports.AddQuestion = async (req, res) => {
  const { title, description } = req.body;
  const { user_id } = req.user;

  if (!title || !description) {
    return res.status(400).json({ msg: "Please provide all information" });
  }
  const question_id = uuidv4();

  try {
    const connection = await pool.getConnection();

    console.log(user_id);
    const sql =
      "INSERT INTO questions (user_id, title, description, question_id) VALUES (?, ?, ?, ?)";
    const [result] = await connection.execute(sql, [
      user_id,
      title,
      description,
      question_id,
    ]);

    connection.release();

    res.status(201).json({
      id: result.insertId,
      message: "Question delivered  successfully",
    });
  } catch (err) {
    console.error("Error delivering message:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllQuestion = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
       questions.id, 
        users.user_id AS user_id, 
        users.email AS email,
        questions.title AS question_title, 
        questions.description AS question_description
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id`
    );
    connection.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllTitle = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
        username AS username,
        question_id As question_id,
        questions.title AS question_title
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id
        ORDER BY questions.id DESC`
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
};

exports.singleQuestionId = async (req, res) => {
  const question_id = req.params.question_id;

  try {
    const [questionRows] = await pool.execute(
      `SELECT 
        question_id,
        title AS question_title,
        description AS question_description
      FROM questions
      WHERE question_id = ?`,
      [question_id]
    );

    if (questionRows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const [answerRows] = await pool.execute(
      `SELECT 
        answers.answer_id,
        answers.user_id,
        answer
      FROM answers
      WHERE question_id = ?
      ORDER BY answers.answer_id DESC`,
      [question_id]
    );

    const question = {
      question_id: questionRows[0].question_id,
      question_title: questionRows[0].question_title,
      question_description: questionRows[0].question_description,
      answers: answerRows.map((row) => ({
        answer_id: row.answer_id,
        answer: row.answer,
      })),
    };

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateQuestion = async (req, res) => {
  const question_id = req.params.question_id;
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .send({ error: "Title and description are required" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(
      "UPDATE questions SET title = ?, description = ? WHERE question_id = ?",
      [title, description, question_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.send({ message: "Question updated successfully" });
  } catch (err) {
    console.error("Error updating question:", err.message);
    res.status(500).json({ error: "Database update failed" });
  } finally {
    if (connection) connection.release();
  }
};

exports.getAllSingleUserTitle = async (req, res) => {
  const { user_id } = req.user;
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
        users.username AS username,
        questions.question_id AS question_id,
        questions.title AS question_title,
        questions.description AS description,
        answers.answer_id,
        answer AS answer
      FROM 
        users
      LEFT JOIN 
      
        questions 
        
        ON users.user_id = questions.user_id
        LEFT JOIN
        answers 
        
        ON users.user_id = answers.user_id
      WHERE 
        users.user_id = ?
      ORDER BY 
        questions.id DESC`,
      [user_id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
};

exports.deleteQuestion = async (req, res) => {
  const { question_id } = req.body;

  if (!question_id) {
    return res.status(400).json({ error: "Question ID is required" });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.execute("DELETE FROM answers WHERE question_id = ?", [
      question_id,
    ]);

    const [result] = await connection.execute(
      "DELETE FROM questions WHERE question_id = ?",
      [question_id]
    );

    await connection.commit();
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Question and related answers deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err.message);
    res.status(500).json({ error: "Database deletion failed" });
  }
};
