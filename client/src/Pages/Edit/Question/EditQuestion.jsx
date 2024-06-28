import React, { useContext, useEffect, useState } from "react";
import axiosBase from "../../../axios/AxiosBase";
import { stateData } from "../../../Routing";
import { Link } from "react-router-dom";
import "./EditQuestion.css";

function EditQuestion() {
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
    (single) => single.question_title && single.description
  );

  return (
    <section className="edit_container_edit">
      <div className="edit_question_edit">
        {validQuestions.length > 0 ? (
          <>
            <div className="header_row_edit">
              <p>Questions You Have Asked Before</p>
              <Link to={"/editAnswer"}>Edit Answer</Link>
            </div>
            <h3>Click on what you want to edit</h3>
            {validQuestions.map((single) => (
              <div key={single.question_id} className="fetched_question_edit">
                <Link
                  to={`/edit/${single.question_id}`}
                  style={{ display: "flex" }}
                >
                  <div>{`Title: ${single.question_title}`}</div>
                  <div>{`Description: ${single.description}`}</div>
                </Link>
              </div>
            ))}
          </>
        ) : (
          <div>No Question Found</div>
        )}
      </div>
    </section>
  );
}

export default EditQuestion;
