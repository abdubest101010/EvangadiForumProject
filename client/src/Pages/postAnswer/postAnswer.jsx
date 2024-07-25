import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosBase from "../../axios/AxiosBase";
import { stateData } from "../../Routing";
import { FaUser } from "react-icons/fa";
import "./postAnswer.css";
import Loader from "../../Component/Loader/Loader";
import { useGetSingleQuestionQuery, usePostAnswerMutation } from "../../Service/features/api";
function PostAnswer() {
  const { user } = useContext(stateData);
  const answerRef = useRef();
  // const [errors, setErrors] = useState("");
  const { questionId } = useParams();
  const navigate=useNavigate()
  // const [question, setQuestion] = useState(null);
  const [loader, setloader] = useState(false);
  const { data: question, error: fetchError, isLoading: isFetching, refetch } = useGetSingleQuestionQuery(questionId);
  const [postAnswer, { error: postError, isLoading: isPosting, }] = usePostAnswerMutation();
  console.log(question)
  // const fetchQuestion = async function () {
  //   try {
  //     setloader(true);
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       localStorage.setItem("token", "");

  //       return;
  //     }
  //     const response = await axiosBase.get(`/questions/${questionId}`, {
  //       headers: {
  //         Authorization: `Bearer ` + token,
  //       },
  //     });
  //     setQuestion(response.data);
  //     setloader(false);
  //   } catch (error) {
  //     console.error("Error fetching question:", error);
  //     setloader(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchQuestion();
  // }, [questionId]);
if(fetchError){
  console.log(fetchError)
}
if(postError){
  console.log(postError)
}
useEffect(() => {
  refetch()
}, [])


  // async function handleAnswerSubmit(e) {
  //   e.preventDefault();
  //   try {
  //     const answerValue = answerRef.current.value;
  //     const question_idValue = question?.question_id;
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       localStorage.setItem("token", "");

  //       return;
  //     }
  //     if (!answerValue || !question_idValue) {
  //       setErrors("Please provide all information");
  //     }

  //     const questionInsert = await axiosBase.post(
  //       "/answers/addAnswer",
  //       {
  //         answer: answerValue,
  //         question_id: question_idValue,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ` + token,
  //         },
  //       }
  //     );

  //     console.log("Form submitted successfully", questionInsert);
  //     fetchQuestion();
  //     answerRef.current.value = "";
  //     setloader(false);
  //   } catch (error) {
  //     console.error("An error occurred while submitting the form:", error);
  //     setErrors(error.response.data.msg);
  //     setloader(false);
  //     console.log(error);
  //   }
  // }
 

  async function handleAnswerSubmit(e) {
    e.preventDefault();
    const user_id=user.user_id
    const answerValue = answerRef.current.value;
    if (!answerValue || !questionId || !user_id) {
      // setErrors("Please provide all information");
      console.log("please provide all information")
      return;
    }

    try {
     
      await postAnswer({ user_id,questionId, answer: answerValue });
      answerRef.current.value = "";
      
      refetch();
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      
    }
  }

  if (!question) {
    return <div>Loading...</div>;
  }
  
  
  
  const deleteQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // setError("Token not found. Please log in.");
        return;
      }
      
       
       
      const response = await axiosBase.delete(`/questions/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          question_id: questionId,
        }
      });

      console.log("Question deleted successfully:", response.data);
      navigate("/home");
    } catch (error) {
      console.error("Error deleting question:", error);
      
    } 
  };
  
  
  const DeleteAnswer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // setError("Token not found. Please log in.");
        return;
      }
      const answer_id=question.answers[0].answer_id
      const response = await axiosBase.delete(`/answers/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          answer_id,
        },
      });
      console.log("Answer updated successfully:", response.data);
      // navigate("/home");
      refetch()
    } catch (error) {
      console.error("Error updating answer:", error);
      // setError("Error updating answer. Please try again.");
    } 
  };

  return (
    <div className="postAnswer_container">
      <div style={{display:"flex", justifyContent:"space-between"} } className="postAnswer_link">
      <h1>Question</h1>
      
        
       
      
      </div>
      <div style={{display:"flex", justifyContent:"space-between"}}>
      <div >
      
      <h2>{`Title: ${question.question_title}`}</h2>
      <p>{`Description: ${question.question_description}`}</p>
      </div>
      <div className="title_question" >
      {
        user.user_id==question.user_id?(
          <>
          <Link to={`/edit/${questionId}`}>Edit Question</Link>
          <button onClick={deleteQuestion}>Delete Question</button>
          </>):""
          
        }
      </div>
      </div>
      <hr />
      <div className="answer_container_box">
        <div>
          {isFetching && <Loader/>}
        </div>
        {question.answers.length > 0 ? (
          <div className="answer_community">
            
            <h1>Answers For the Top Question</h1>
         
           
            
            
            {question.answers.map((answer,id) => (
              <div key={id} className="answer_icon" style={{justifyContent:"space-between"}}>
                <div key={answer.answer_id}>
               
                  <div className="icon_fix">
                    <i>
                      <FaUser />{" "}
                    </i>
                    <div className="answer_fix">{answer.answer}</div>
                  </div>
                  <div>{user.username}</div>
                 
                </div>
                {
        user.user_id===answer.user_id?(
          <>
          <div className="post_answer_editAndAnswer">
           <Link to={`/editAnswer/${answer.answer_id}`} style={{height:"25px",paddingTop:"9px"}}>Edit Answer</Link>
           <button onClick={DeleteAnswer}>Delete Answer</button>
           </div>
          </>):""
          
        }
              </div>
            ))}
          </div>
        ) : (
          ""
        )}

        <div>
          {postError && (
            <p
              className="error-message"
              style={{ color: "red", fontSize: "30px" }}
            >
              {postError}
            </p>
          )}
          <textarea type="text" placeholder="Your Answer" ref={answerRef} />
        </div>
        <button onClick={handleAnswerSubmit}>
          {isPosting ? <Loader /> : "Post Answer"}
        </button>
      </div>
    </div>
  );
}

export default PostAnswer;
