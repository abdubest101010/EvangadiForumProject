const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }
  const token=authHeader.split(' ')[1]
  try {
    const {username, user_id, email, password} = jwt.verify(token, process.env.secretKey);
    
    req.user = {username, user_id, email, password};
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authenticateToken;
