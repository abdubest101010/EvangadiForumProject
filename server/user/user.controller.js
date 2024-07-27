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
    const client = await pool.connect();

    const { rows: existingUsers } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const { rows: existingUsername } = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (existingUsers.length > 0) {
      client.release();
      return res.status(401).json({ msg: "User already exists" });
    }

    if (existingUsername.length > 0) {
      client.release();
      return res.status(401).json({ msg: "Username already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql =
      "INSERT INTO users (username, email, firstName, lastName, password) VALUES ($1, $2, $3, $4, $5) RETURNING user_id";
    const { rows: result } = await client.query(sql, [
      username,
      email,
      firstName,
      lastName,
      hashedPassword,
    ]);
    req.body.id = result[0].user_id;
    client.release();

    res
      .status(201)
      .json({ id: result[0].user_id, message: "User registered successfully" });
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
    const client = await pool.connect();

    const { rows } = await client.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    client.release();

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
    const client = await pool.connect();

    const { rows } = await client.query("SELECT * FROM users");
    client.release();

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
    const client = await pool.connect();

    const { rows: existingEmail } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingEmail.length == 0) {
      return res.status(401).json({ message: "Email does not exist" });
    }
    const user = existingEmail[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const { user_id, username } = user;
    const token = jwt.sign(
      { user_id, username, email },
      process.env.secretKey,
      {
        expiresIn: "1h",
      }
    );

    client.release();

    return res.status(200).json({ username, token: token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.check = (req, res) => {
  const { username, user_id, email, password } = req.user;
  res
    .status(200)
    .json({ message: "valid user", username, user_id, email, password });
};
