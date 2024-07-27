const pool = require("../config/database");

exports.AddAnswer = async (req, res) => {
  const { question_id, answer, user_id } = req.body;

  console.log("Received payload:", { question_id, answer, user_id }); // Log the payload

  if (!answer || !question_id || !user_id) {
    return res.status(400).json({ msg: "Please provide all information" });
  }

  try {
    const client = await pool.connect();
    const sql =
      "INSERT INTO answers (user_id, question_id, answer) VALUES ($1, $2, $3) RETURNING answer_id";
    const result = await client.query(sql, [user_id, question_id, answer]);

    client.release();

    res
      .status(201)
      .json({ id: result.rows[0].answer_id, message: "Answer delivered successfully" });
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

  try {
    const client = await pool.connect();

    const sql =
      "UPDATE answers SET answer = $1 WHERE answer_id = $2 RETURNING answer_id";
    const result = await client.query(sql, [answer, answer_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    client.release();
    res.send({ message: "Answer updated successfully" });
  } catch (err) {
    console.error("Error updating answer:", err.message);
    res.status(500).json({ error: "Database update failed" });
  }
};
exports.answersByQuestionId = async (req, res) => {
  const question_id = req.params.question_id;

  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        answers.user_id,
        answers.answer_id,
        users.username,
        answers.answer
      FROM answers
      LEFT JOIN users ON answers.user_id = users.user_id
      WHERE question_id = $1
      ORDER BY answers.answer_id DESC`;

    const result = await client.query(sql, [question_id]);

    const answers = result.rows.map((row) => ({
      user_id: row.user_id,
      answer_id: row.answer_id,
      username: row.username,
      answer: row.answer,
    }));

    client.release();
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllAnswers = async (req, res) => {
  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        answers.answer_id,
        answers.answer,
        answers.question_id,
        answers.user_id,
        users.username AS username
      FROM 
        answers
      LEFT JOIN 
        users ON answers.user_id = users.user_id`;

    const result = await client.query(sql);
    client.release();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching answers:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.UserAnswer = async (req, res) => {
  const { user_id } = req.user;

  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
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
        users.user_id = $1 AND answers.answer_id IS NOT NULL
      ORDER BY 
        questions.question_id DESC`;

    const result = await client.query(sql, [user_id]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Answers not found" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching answers:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTitlesWithAnswers = async (req, res) => {
  const { user_id } = req.user;

  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        questions.question_id,
        questions.title AS question_title,
        answers.answer_id,
        answers.answer AS answer
      FROM 
        questions 
      LEFT JOIN 
        answers ON questions.question_id = answers.question_id AND answers.user_id = $1
      WHERE 
        questions.user_id = $1 AND answers.answer_id IS NOT NULL
      ORDER BY 
        answers.answer_id DESC`;

    const result = await client.query(sql, [user_id]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Titles with answers not found" });
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching titles with answers:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteAnswer = async (req, res) => {
  const { answer_id } = req.body;

  if (!answer_id) {
    return res.status(400).json({ error: "Answer ID is required" });
  }

  try {
    const client = await pool.connect();

    const sql = "DELETE FROM answers WHERE answer_id = $1 RETURNING answer_id";
    const result = await client.query(sql, [answer_id]);

    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    res.json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error("Error deleting answer:", err.message);
    res.status(500).json({ error: "Database deletion failed" });
  }
};

exports.singleAnswerId = async (req, res) => {
  const answer_id = req.params.answer_id;

  try {
    const client = await pool.connect();

    const sql = `
      SELECT 
        answers.answer_id,
        answers.question_id,
        answers.answer,
        questions.title AS question_title
      FROM answers
      LEFT JOIN questions ON answers.question_id = questions.question_id
      WHERE answers.answer_id = $1`;

    const result = await client.query(sql, [answer_id]);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const answer = {
      answer_id: result.rows[0].answer_id,
      question_id: result.rows[0].question_id,
      question_title: result.rows[0].question_title,
      answer: result.rows[0].answer,
    };

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error fetching answer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
