const authenticateToken = require("../api/middleware/auth");
const express = require("express");
const {
  AddQuestion,
  userIdSelect,
  getAllQuestion,
  getAllTitle,
  
  
  getQuestionById,
  
} = require("./question.controller");

const questionRouter = express.Router();
questionRouter.post("/add", userIdSelect, AddQuestion);
questionRouter.get("/allquestions", getAllQuestion);
questionRouter.get("/alltitles", getAllTitle);

questionRouter.get("/:question_id", getQuestionById);



module.exports = questionRouter;
