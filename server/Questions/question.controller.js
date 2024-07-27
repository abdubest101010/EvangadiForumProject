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
    const client = await pool.connect();

    console.log(user_id);
    const sql =
      "INSERT INTO questions (user_id, title, description, question_id) VALUES ($1, $2, $3, $4) RETURNING id";
    const result = await client.query(sql, [
      user_id,
      title,
      description,
      question_id,
    ]);

    client.release();

    res.status(201).json({
      id: result.rows[0].id,
      message: "Question delivered successfully",
    });
  } catch (err) {
    console.error("Error delivering message:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllQuestion = async (req, res) => {
  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        questions.id, 
        users.user_id AS user_id, 
        users.email AS email,
        questions.title AS question_title, 
        questions.description AS question_description
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id`;

    const result = await client.query(sql);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.singleQuestionWithoutAnswers = async (req, res) => {
  const question_id = req.params.question_id;

  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        questions.user_id,
        question_id,
        title AS question_title,
        description AS question_description
      FROM questions
      WHERE question_id = $1`;

    const result = await client.query(sql, [question_id]);

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Question not found" });
    }

    const question = {
      user_id: result.rows[0].user_id,
      question_id: result.rows[0].question_id,
      question_title: result.rows[0].question_title,
      question_description: result.rows[0].question_description,
    };

    client.release();
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAllTitle = async (req, res) => {
  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        users.username AS username,
        questions.question_id AS question_id,
        questions.title AS question_title
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id
      ORDER BY questions.id DESC`;

    const result = await client.query(sql);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.singleQuestionId = async (req, res) => {
  const question_id = req.params.question_id;

  try {
    const client = await pool.connect();

    const questionSql = `
      SELECT 
        questions.user_id,
        question_id,
        title AS question_title,
        description AS question_description
      FROM questions
      WHERE question_id = $1`;

    const questionResult = await client.query(questionSql, [question_id]);

    if (questionResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Question not found" });
    }

    const answerSql = `
      SELECT 
        answers.user_id,
        answers.answer_id,
        users.username,
        answers.answer
      FROM answers
      LEFT JOIN users ON answers.user_id = users.user_id
      WHERE question_id = $1
      ORDER BY answers.answer_id DESC`;

    const answerResult = await client.query(answerSql, [question_id]);

    const question = {
      user_id: questionResult.rows[0].user_id,
      question_id: questionResult.rows[0].question_id,
      question_title: questionResult.rows[0].question_title,
      question_description: questionResult.rows[0].question_description,
      answers: answerResult.rows.map((row) => ({
        user_id: row.user_id,
        answer_id: row.answer_id,
        username: row.username,
        answer: row.answer,
      })),
    };

    client.release();
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

  try {
    const client = await pool.connect();

    const sql =
      "UPDATE questions SET title = $1, description = $2 WHERE question_id = $3 RETURNING id";
    const result = await client.query(sql, [title, description, question_id]);

    if (result.rowCount === 0) {
      client.release();
      return res.status(404).json({ error: "Question not found" });
    }

    client.release();
    res.send({ message: "Question updated successfully" });
  } catch (err) {
    console.error("Error updating question:", err.message);
    res.status(500).json({ error: "Database update failed" });
  }
};

exports.getAllSingleUserTitle = async (req, res) => {
  const { user_id } = req.user;

  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        users.username AS username,
        questions.question_id AS question_id,
        questions.title AS question_title,
        questions.description AS description,
        answers.answer_id,
        answers.answer
      FROM 
        users
      LEFT JOIN 
        questions ON users.user_id = questions.user_id
      LEFT JOIN
        answers ON questions.question_id = answers.question_id
      WHERE 
        users.user_id = $1
      ORDER BY 
        questions.id DESC`;

    const result = await client.query(sql, [user_id]);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { question_id } = req.body;

  if (!question_id) {
    return res.status(400).json({ error: "Question ID is required" });
  }

  try {
    const client = await pool.connect();
    await client.query("BEGIN");

    await client.query("DELETE FROM answers WHERE question_id = $1", [
      question_id,
    ]);

    const result = await client.query(
      "DELETE FROM questions WHERE question_id = $1 RETURNING id",
      [question_id]
    );

    await client.query("COMMIT");
    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Question and related answers deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err.message);
    res.status(500).json({ error: "Database deletion failed" });
  }
};
