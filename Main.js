const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const questionRouter = require("./server/Questions/question.route");
const router = require("./server/user/user.router");
const answerRouter=require("./server/Answers/answer.router")
app.use(cors());
app.use(express.json());
PORT = process.env.PORT;

app.use("/api/users", router);
app.use("/api/questions", questionRouter);
app.use("/api/answers", answerRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
