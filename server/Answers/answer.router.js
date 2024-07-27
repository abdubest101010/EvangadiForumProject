const express = require("express");
const authenticateToken = require("../api/middleware/auth");
const {
  AddAnswer,
  getAllAnswers,
  updateAnswer,
  getTitlesWithAnswers,
  singleAnswerId,
  deleteAnswer,
  answersByQuestionId,
} = require("./answers.controller");

const answerRouter = express.Router();
answerRouter.get("/titlesWithAnswers", authenticateToken, getTitlesWithAnswers);
answerRouter.post("/addAnswer", authenticateToken, AddAnswer);
answerRouter.put("/updateAnswer/:answer_id", authenticateToken, updateAnswer);
answerRouter.get("/getAnswers", authenticateToken, getAllAnswers);
answerRouter.get("/:answer_id", authenticateToken, singleAnswerId);
answerRouter.get("/byQuestionId/:question_id", authenticateToken, answersByQuestionId); // New route
answerRouter.delete("/delete", authenticateToken, deleteAnswer);

module.exports = answerRouter;
