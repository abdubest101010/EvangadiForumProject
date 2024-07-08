import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosBase from "../../axios/AxiosBase";
import { stateData } from "../../Routing";
import "./AskQuestion.css";
import Loader from "../../Component/Loader/Loader";
import {  usePostQuestionMutation } from "../../Service/features/api";
function AskQuestion() {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const { user } = useContext(stateData);
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  // const [loader, setloader] = useState(false);
  const [postQuestion, { error: postError, isLoading: isPosting }] = usePostQuestionMutation();
  async function handler(e) {
    e.preventDefault();
    // setloader(true);
    try {
      const titleValue = titleRef.current.value;
      const descriptionValue = descriptionRef.current.value;
      const emailValue = user?.email;
      
      if(postError){
        console.log(postError)
      }
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   localStorage.setItem("token", "");

      //   return;
      // }
      if (!titleValue || !descriptionValue|| emailValue) {
        setErrors("Please provide all information");
        
      }
      if (!emailValue) {
        setErrors("User email is missing");
      }

      // const questionInsert = await axiosBase.post(
      //   "/questions/add",
      //   {
      //     title: titleValue,
      //     description: descriptionValue,
      //     email: emailValue,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ` + token,
      //     },
      //   }
      // );

      // console.log("Form submitted successfully", questionInsert);
      // setloader(false);

      await postQuestion({ title:titleValue,description:descriptionValue,email:emailValue });
      
      
      navigate("/home");
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      console.log(error);
      // setErrors(error.response.data.msg);
      // setloader(false);
      console.log(error);
    }
  }

  return (
    <div className="askQuestion_container">
      <div className="questions">
        <h1>Steps to write a good question</h1>
        <ul>
          <li>Summarize your problem in one-line title</li>
          <li>Describe your problem in more detail</li>
          <li>Describe what you tried and what you expected to happen</li>
          <li>Review your question and post in the site</li>
        </ul>
        <h1>Ask a public question</h1>
        {errors && (
          <p
            className="error-message"
            style={{ color: "red", fontSize: "30px" }}
          >
            {errors}
          </p>
        )}
        <a href="/">Go to question page</a>
        <form onSubmit={handler}>
          <div className="inputAddress">
            <div className="names">
              <input ref={titleRef} type="text" placeholder="Enter title" />
              <textarea
                ref={descriptionRef}
                type="text"
                placeholder="Enter Description"
              />
            </div>
            <button type="submit">
              {isPosting ? <Loader /> : "Post your Question"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AskQuestion;
