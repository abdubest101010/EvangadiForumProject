import React, { useContext, useEffect, useState } from "react";
import axiosBase from "../../../axios/AxiosBase";
import { stateData } from "../../../Routing";
import { Link } from "react-router-dom";
import "./DeleteQuestion.css";

function DeleteQuestion() {
  const { user } = useContext(stateData);
  const [questions, setQuestions] = useState([]);

  const user_idValue = user?.user_id;

  useEffect(() => {
    const fetchSingleUserTitle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axiosBase.get(
          `/questions/singleTitle?user_id=${user_idValue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    if (user_idValue) {
      fetchSingleUserTitle();
    }
  }, [user_idValue]);

  const validQuestions = questions.filter(
    (question) => question.question_title && question.description
  );

  return (
    <section className="delete_container">
      <div className="delete_question">
        {validQuestions.length > 0 && (
          <div className="header_row_delete">
            <p>Questions You Have Asked Before</p>
            <Link to={"/deleteAnswer"}>Delete Answer</Link>
          </div>
        )}
        {validQuestions.length > 0 ? (
          <>
            <h3>Click on what you want to delete</h3>
            {validQuestions.map((single) => (
              <div key={single.question_id} className="fetched_question_delete">
                <Link
                  to={`/delete/${single.question_id}`}
                  style={{ display: "flex" }}
                >
                  <div>{`Title: ${single.question_title}`}</div>
                  <div>{`Description: ${single.description}`}</div>
                </Link>
              </div>
            ))}
          </>
        ) : (
          <div>No Questions Found</div>
        )}
      </div>
    </section>
  );
}

export default DeleteQuestion;
