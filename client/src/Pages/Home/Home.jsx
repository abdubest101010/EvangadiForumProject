import React, { useContext, useState, useEffect } from "react";
import { stateData } from "../../Routing";
import axiosBase from "../../axios/AxiosBase";
import "./Home.css";
import { FaGreaterThan, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
import { useGetAllQuestionsQuery } from "../../Service/features/api";
function Home() {
  const { user } = useContext(stateData);
  // const [titles, setTitles] = useState([]);
  const navigate = useNavigate();
  const { data:titles, error, isLoading, refetch } = useGetAllQuestionsQuery();
  // const [loader, setloader] = useState(false);
  // useEffect(() => {
  //   async function fetchTitles() {
  //     try {
  //       setloader(true);
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         localStorage.setItem("token", "");

  //         return;
  //       }

  //       const { data } = await axiosBase.get("/questions/alltitles", {
  //         headers: {
  //           Authorization: `Bearer ` + token,
  //         },
  //       });
  //       console.log("Fetched Data:", data);
  //       setTitles(data);
  //       setloader(false);
  //     } catch (error) {
  //       console.error("Error fetching titles:", error);
  //       setloader(false);
  //     }
  //   }

  //   fetchTitles();
  // }, []);
  if(error){
    console.log(error)
  }

  useEffect(() => {
    refetch()
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <section className="home_container">
      <div className="home_header">
        <Link to={"/askquestion"} className="ask-question">
          {isLoading ? <Loader /> : "Ask Question"}
        </Link>
        <Link to={"/edit"} className="ask-question">
          {isLoading ? <Loader /> : "Edit"}
        </Link>
        <Link to={"/delete"} className="ask-question">
          {isLoading ? <Loader /> : "Delete"}
        </Link>
        {user && <h1 className="welcome">Welcome, {user.username}!</h1>}
      </div>

      <div className="content">
        {titles?.length > 0 && <h1 className="question-title">Questions</h1>}
        <div className="questions-list">
          {titles?.length > 0 ? (
            <>
              {titles?.map((title, index) =>
                title?.question_title ? (
                  <>
                    {<hr />}
                    <div className="question-item">
                      <div className="icon_fixing">
                        <FaUser color="black" />
                        {title.username}
                      </div>
                      <div className="title_fixing">
                        <Link to={`/home/${title.question_id}`}>
                          <div className="FaGreaterThan">
                            {title.question_title}
                            <FaGreaterThan className="icon_right" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : null
              )}
            </>
          ) : (
            <p>No questions available</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Home;
