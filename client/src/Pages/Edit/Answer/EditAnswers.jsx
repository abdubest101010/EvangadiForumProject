import React, { useContext, useEffect, useState } from "react";
import axiosBase from "../../../axios/AxiosBase";
import { stateData } from "../../../Routing";
import { Link } from "react-router-dom";
import "./EditAnswer.css";

function EditAnswers() {
  const { user } = useContext(stateData);
  const [answers, setAnswers] = useState([]);

  const user_idValue = user?.user_id;

  useEffect(() => {
    const fetchUserAnswers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axiosBase.get(
          `/answers/titlesWithAnswers?user_id=${user_idValue}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        setAnswers(response.data);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    if (user_idValue) {
      fetchUserAnswers();
    }
  }, [user_idValue]);

  return (
    <section className="answers_container">
      <div className="answers_list">
        {answers.length > 0 ? (
          <>
            <p>Answers You Have Provided</p>
            <h2 style={{ textAlign: "center" }}>
              Click on what you want to edit
            </h2>
            {answers.map((answer) => (
              <div key={answer.answer_id} className="fetched_answer">
                <Link
                  to={`/editAnswer/${answer.answer_id}`}
                  style={{ display: "flex" }}
                >
                  <div>{`Question: ${answer.question_title}`}</div>
                  <div>{`Answer: ${answer.answer}`}</div>
                </Link>
              </div>
            ))}
          </>
        ) : (
          <div>No Answer Found</div>
        )}
      </div>
    </section>
  );
}

export default EditAnswers;
