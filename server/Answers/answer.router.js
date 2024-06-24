const authenticateToken = require("../api/middleware/auth");
const express = require("express");
const {
  questionIdSelect,
  AddAnswer,
  getAllAnswer,
  postAnswer,
} = require("./answers.controller");
const { userIdSelect } = require("../Questions/question.controller");

const answerRouter = express.Router();
answerRouter.post(
  "/addAnswer",
  
  userIdSelect,
  questionIdSelect,
  AddAnswer
);
// answerRouter.post("/answers/:questionId/answers", postAnswer);
answerRouter.get("/getAnswer", getAllAnswer);

module.exports = answerRouter;
