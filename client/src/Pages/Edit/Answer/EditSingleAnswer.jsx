import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosBase from "../../../axios/AxiosBase";
import "./EditSingleAnswer.css";

function EditSingleAnswer() {
  const { answer_id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

  const answerRef = useRef();
  const navigate = useNavigate();

  const fetchAnswer = async () => {
    try {
      setLoader(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        return;
      }
      const response = await axiosBase.get(`/answers/${answer_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched answer data:", response.data); // Log the response data
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching answer:", error);
      setError("Error fetching answer. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAnswer();
  }, [answer_id]);

  const updateAnswer = async (e) => {
    e.preventDefault();
    try {
      const answerValue = answerRef.current.value;
      setLoader(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        return;
      }
      const response = await axiosBase.put(
        `/answers/updateAnswer/${answer_id}`,
        {
          answer: answerValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Answer updated successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error updating answer:", error);
      setError("Error updating answer. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  if (loader) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="edit_container">
      {question ? (
        <div className="edit_form">
          <h1>Edit Answer</h1>
          <form onSubmit={updateAnswer}>
            <div className="current_info">
              <div>{`Title: ${question.question_title}`}</div>
              <div>{`Current Answer: ${question.answer}`}</div>
            </div>
            <div>
              <label>New Answer</label>
              <textarea ref={answerRef}></textarea>
            </div>
            <button type="submit">Update Answer</button>
          </form>
        </div>
      ) : (
        <div className="error">No Answer Found</div>
      )}
    </div>
  );
}

export default EditSingleAnswer;
