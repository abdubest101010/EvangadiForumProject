import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosBase from "../../../axios/AxiosBase";
import "./DeleteSingleQuestion.css";
function EditSingleQuestion() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

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

  const deleteQuestion = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        return;
      }

      const response = await axiosBase.delete(`/questions/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          question_id: question.question_id,
        },
      });

      console.log("Question deleted successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting question:", error);
      setError("Error deleting question. Please try again.");
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
    <div className="edit_containers">
      {question ? (
        <div className="edit_forms">
          <h1>Delete Question</h1>
          <h2>Are You sure you want to delete? it is irreversible</h2>
          <form onSubmit={deleteQuestion}>
            <div className="current_infos">
              <div>{`Title: ${question.question_title}`}</div>
              <div>{`Description: ${question.question_description}`}</div>
            </div>
            <button type="submit">Delete Question</button>
          </form>
        </div>
      ) : (
        <div className="errors">No Question Found</div>
      )}
    </div>
  );
}

export default EditSingleQuestion;
