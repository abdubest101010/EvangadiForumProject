const {register, login, check, getAllUsers, getUserById} = require("../user/user.controller");
const authenticateToken=require("../api/middleware/auth")
const express = require("express");
const router = express.Router();
router.post("/", register);
router.post("/login", login);
router.get("/check", authenticateToken, check);
router.get("/all", getAllUsers);
router.get("/single", getUserById);
module.exports=router