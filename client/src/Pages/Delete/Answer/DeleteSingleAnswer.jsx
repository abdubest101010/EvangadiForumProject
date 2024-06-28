import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosBase from "../../../axios/AxiosBase";

function EditSingleAnswer() {
  const { answer_id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(null);

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

  const DeleteAnswer = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token not found. Please log in.");
        return;
      }
      const response = await axiosBase.delete(`/answers/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          answer_id: question.answer_id,
        },
      });
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
    <div className="edit_containers">
      {question ? (
        <div className="edit_forms">
          <h1>Delete Answer</h1>
          <h2>Are You Want to Delete? It is irreversible</h2>
          <form onSubmit={DeleteAnswer}>
            <div className="current_infos">
              <div>{`Title: ${question.question_title}`}</div>
              <div>{`Current Answer: ${question.answer}`}</div>
            </div>
            <button type="submit">Delete Answer</button>
          </form>
        </div>
      ) : (
        <div className="errors">No Answer Found</div>
      )}
    </div>
  );
}

export default EditSingleAnswer;
