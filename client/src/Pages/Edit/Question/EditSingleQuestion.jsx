import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosBase from "../../../axios/AxiosBase";
import "./EditSingleQuestion.css";

function EditSingleQuestion() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);
  const titleRef = useRef();
  const descriptionRef = useRef();
  const navigate = useNavigate();

  const fetchQuestion = async () => {
    try {
      setLoader(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        return;
      }
      const response = await axiosBase.get(`/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Error fetching question. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const updateQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      setError(null);
      const titleValue = titleRef.current.value;
      const descriptionValue = descriptionRef.current.value;
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        return;
      }
      const response = await axiosBase.put(
        `/questions/update/${questionId}`,
        {
          title: titleValue,
          description: descriptionValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuestion(response.data);
      console.log("Question updated successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error updating question:", error);
      setError("Error updating question. Please try again.");
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
          <h1>Edit Question</h1>
          <form onSubmit={updateQuestion}>
            <div className="current_info">
              <div>{`Title: ${question.question_title}`}</div>
            </div>
            <div>
              <label>Title</label>
              <input type="text" ref={titleRef} />
            </div>
            <div>
              <label>Description</label>
              <textarea ref={descriptionRef}></textarea>
            </div>
            <button type="submit">Update Question</button>
          </form>
        </div>
      ) : (
        <div className="error">No Question Found</div>
      )}
    </div>
  );
}

export default EditSingleQuestion;
