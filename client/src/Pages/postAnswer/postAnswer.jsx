import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosBase from "../../axios/AxiosBase";
import { stateData } from "../../Routing";
import { FaUser } from "react-icons/fa";
import "./postAnswer.css";
import Loader from "../../Component/Loader/Loader";
function PostAnswer() {
  const { user } = useContext(stateData);
  const answerRef = useRef();
  const [errors, setErrors] = useState("");
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loader, setloader] = useState(false);

  const fetchQuestion = async function () {
    try {
      setloader(true);
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("token", "");

        return;
      }
      const response = await axiosBase.get(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ` + token,
        },
      });
      setQuestion(response.data);
      setloader(false);
    } catch (error) {
      console.error("Error fetching question:", error);
      setloader(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  async function handleAnswerSubmit(e) {
    e.preventDefault();
    try {
      const answerValue = answerRef.current.value;
      const question_idValue = question?.question_id;
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("token", "");

        return;
      }
      if (!answerValue || !question_idValue) {
        setErrors("Please provide all information");
      }

      const questionInsert = await axiosBase.post(
        "/answers/addAnswer",
        {
          answer: answerValue,
          question_id: question_idValue,
        },
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      );

      console.log("Form submitted successfully", questionInsert);
      fetchQuestion();
      answerRef.current.value = "";
      setloader(false);
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      setErrors(error.response.data.msg);
      setloader(false);
      console.log(error);
    }
  }

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="postAnswer_container">
      <h1>Question</h1>
      <h2>{question.question_title}</h2>
      <p>{question.question_description}</p>
      <hr />
      <div className="answer_container_box">
        {question.answers.length > 0 ? (
          <div className="answer_community">
            <h1>Answer the Top Question</h1>
            {question.answers.map((answer) => (
              <div className="answer_icon">
                <div key={answer.answer_id}>
                  <div className="icon_fix">
                    <i>
                      <FaUser />{" "}
                    </i>
                    <div className="answer_fix">{answer.answer}</div>
                  </div>
                  <div>{user.username}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        <div>
          {errors && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "30px" }}
            >
              {errors}
            </p>
          )}
          <textarea type="text" placeholder="Your Answer" ref={answerRef} />
        </div>
        <button onClick={handleAnswerSubmit}>
          {loader ? <Loader /> : "Post Answer"}
        </button>
      </div>
    </div>
  );
}

export default PostAnswer;
