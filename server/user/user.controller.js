const bcrypt = require("bcrypt");
const pool = require("../config/database");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;

  if (!username || !email || !firstName || !password || !lastName) {
    return res.status(400).json({ msg: "Please provide all information" });
  } else if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 8 characters!" });
  }

  try {
    const connection = await pool.getConnection();

    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(401).json({ msg: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql =
      "INSERT INTO users (username, email, firstName, lastName, password) VALUES (?, ?, ?, ?, ?)";
    const [result] = await connection.execute(sql, [
      username,
      email,
      firstName,
      lastName,
      hashedPassword,
    ]);
    req.body.id = result.insertId;
    connection.release();

    res
      .status(201)
      .json({ id: result.insertId, message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err.message);
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

exports.getAllUsers = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.execute("SELECT * FROM users");
    connection.release();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({ message: "Please provide all information" });
  }

  try {
    const connection = await pool.getConnection();

    const [existingEmail] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length == 0) {
      return res.status(401).json({ message: "Email is not existed" });
    }
    const user = existingEmail[0];
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credential" });
    }
    const { user_id, username } = user;
    const token = jwt.sign({ user_id, username,email, password }, process.env.secretKey, {
      expiresIn: "1h",
    });

    connection.release();

    return res.status(200).json({ username, token: token });
  } catch (error) {
    console.error("Error registering user:", error.message);
  }
};
exports.check = (req, res) => {
  const { username, user_id, email, password } = req.user;
  res.status(200).json({ message: "valid user", username, user_id, email, password});
};
