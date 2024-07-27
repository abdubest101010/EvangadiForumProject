const express = require("express");
const authenticateToken = require("../api/middleware/auth");
const {
  AddQuestion,
  getAllQuestion,
  getAllTitle,
  deleteQuestion,
  updateQuestion,
  singleQuestionId,
  singleQuestionWithoutAnswers,
  getAllSingleUserTitle,
} = require("./question.controller");

const questionRouter = express.Router();
questionRouter.post("/add", authenticateToken, AddQuestion);
questionRouter.get("/allquestions", authenticateToken, getAllQuestion);
questionRouter.get("/alltitles", authenticateToken, getAllTitle);
questionRouter.put("/update/:question_id", authenticateToken, updateQuestion);
questionRouter.get("/singleTitle", authenticateToken, getAllSingleUserTitle);
questionRouter.get("/:question_id", authenticateToken, singleQuestionId);
questionRouter.get("/withoutAnswers/:question_id", authenticateToken, singleQuestionWithoutAnswers); // New route
questionRouter.delete("/delete", authenticateToken, deleteQuestion);

module.exports = questionRouter;
