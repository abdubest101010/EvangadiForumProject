import React, { useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { stateData } from "../../Routing";
import { FaUser } from "react-icons/fa";
import "./postAnswer.css";
import Loader from "../../Component/Loader/Loader";
import {
  useGetSingleQuestionQuery,
  useGetAnswersByQuestionIdQuery,
  usePostAnswerMutation,
  useDeleteQuestionMutation,
  useDeleteAnswerMutation,
} from "../../Service/features/api";

function PostAnswer() {
  const { user } = useContext(stateData);
  const answerRef = useRef();
  const { questionId } = useParams();
  const navigate = useNavigate();

  const { data: question, error: questionError, isLoading: isQuestionLoading } = useGetSingleQuestionQuery(questionId);
  const { data: answers, error: answersError, isLoading: isAnswersLoading, refetch } = useGetAnswersByQuestionIdQuery(questionId);
  const [postAnswer, { error: postError, isLoading: isPosting }] = usePostAnswerMutation();
  const [deleteQuestion, { error: deleteQuestionError }] = useDeleteQuestionMutation();
  const [deleteAnswer, { error: deleteAnswerError }] = useDeleteAnswerMutation();

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    const user_id = user?.user_id;
    const answerValue = answerRef.current.value;

    if (!answerValue || !questionId || !user_id) {
      console.log("Please provide all information");
      return;
    }

    const payload = { question_id: questionId, answer: answerValue, user_id };
    console.log("Payload being sent:", payload);

    try {
      await postAnswer(payload).unwrap();
      answerRef.current.value = "";
      refetch();
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      if (error?.data) {
        console.error("Error data:", error.data);
      }
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await deleteQuestion(questionId).unwrap();
      navigate('/'); // Redirect to home or another appropriate page
    } catch (error) {
      console.error("An error occurred while deleting the question:", error);
      if (error?.data) {
        console.error("Error data:", error.data);
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteAnswer(answerId).unwrap();
      refetch();
    } catch (error) {
      console.error("An error occurred while deleting the answer:", error);
      if (error?.data) {
        console.error("Error data:", error.data);
      }
    }
  };

  if (isQuestionLoading || isAnswersLoading) {
    return <Loader />;
  }

  if (questionError) {
    console.error("Question Error:", questionError);
  }

  if (answersError) {
    console.error("Answers Error:", answersError);
  }

  return (
    <div className="postAnswer_container">
      <div style={{ display: "flex", justifyContent: "space-between" }} className="postAnswer_link">
        <h1>Question</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>{`Title: ${question?.question_title || "No title available"}`}</h2>
          <p>{`Description: ${question?.question_description || "No description available"}`}</p>
        </div>
        <div className="title_question">
          {user?.user_id === question?.user_id && (
            <>
              <Link to={`/edit/${questionId}`}>Edit Question</Link>
              <button onClick={handleDeleteQuestion}>Delete Question</button>
            </>
          )}
        </div>
      </div>
      <hr />
      <div className="answer_container_box">
        <div>
          {isAnswersLoading && <Loader />}
        </div>
        {answers?.length > 0 ? (
          <div className="answer_community">
            <h1>Answers For the Top Question</h1>
            {answers.map((answer) => (
              <div key={answer.answer_id} className="answer_icon" style={{ justifyContent: "space-between" }}>
                <div>
                  <div className="icon_fix">
                    <i>
                      <FaUser />{" "}
                    </i>
                    <div className="answer_fix">{answer.answer || "No answer provided"}</div>
                  </div>
                  <div>{answer.username || "Anonymous"}</div>
                </div>
                {user?.user_id === answer.user_id && (
                  <div className="post_answer_editAndAnswer">
                    <Link to={`/editAnswer/${answer.answer_id}`} style={{ height: "25px", paddingTop: "9px" }}>Edit Answer</Link>
                    <button onClick={() => handleDeleteAnswer(answer.answer_id)}>Delete Answer</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        <div>
          {postError && <p className="error-message" style={{ color: "red", fontSize: "30px" }}>{postError?.data?.message || "An error occurred while posting the answer"}</p>}
          <textarea type="text" placeholder="Your Answer" ref={answerRef} />
        </div>
        <button onClick={handleAnswerSubmit}>{isPosting ? <Loader /> : "Post Answer"}</button>
      </div>
    </div>
  );
}

export default PostAnswer;
