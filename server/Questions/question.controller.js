const pool = require("../config/database");
const { v4: uuidv4 } = require("uuid");

exports.userIdSelect = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: "User not found" });
    }

    req.body.user_id = rows[0].user_id;
    connection.release();
    next();
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.AddQuestion = async (req, res) => {
  const { user_id, title, description } = req.body;

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
exports.getUserById = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [id]
    );
    connection.release();

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllQuestion = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      `SELECT 
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
        users.user_id, 
        username AS username,
        email AS email,
        questions.id,
        question_id As question_id,
        questions.title AS question_title,
        description As description
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id
        ORDER BY questions.id DESC`
    );
    console.log(rows[0].question_id);
    req.question_id = rows[0];
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
  }
};


exports.getQuestionById = async (req, res) => {
  const question_id = req.params.question_id;

  try {
    // Fetch the question details from questions table
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
      return res.status(404).json({ error: 'Question not found' });
    }

    // Fetch associated answers from answers table
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
      answers: answerRows.map(row => ({
        answer_id: row.answer_id,
        answer: row.answer
      }))
    };

    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

