import React, { useContext, useState, useEffect } from "react";
import { stateData } from "../../Routing";
import axiosBase from "../../axios/AxiosBase";
import "./Home.css";
import { FaGreaterThan, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../Component/Loader/Loader";
function Home() {
  const { user } = useContext(stateData);
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate();
  const [loader, setloader] = useState(false);
  useEffect(() => {
    async function fetchTitles() {
      try {
        setloader(true);
        const { data } = await axiosBase.get("/questions/alltitles");
        console.log("Fetched Data:", data);
        setTitles(data);
        setloader(false);
      } catch (error) {
        console.error("Error fetching titles:", error);
        setloader(false);
      }
    }

    fetchTitles();
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <section className="home_container">
      <div className="home_header">
        <a href="/askquestion" className="ask-question">
          {loader ? <Loader /> : "Ask Question"}
        </a>
        {user && <h1 className="welcome">Welcome, {user.username}!</h1>}
      </div>

      <div className="content">
        {titles.length > 0 && <h1 className="question-title">Questions</h1>}
        <div className="questions-list">
          {titles.length > 0 ? (
            <>
              {titles.map((title, index) =>
                title.question_title ? (
                  <>
                    {<hr />}
                    <div className="question-item">
                      <div className="icon_fixing">
                        <FaUser color="black" />
                        {title.username}
                      </div>
                      <div className="title_fixing">
                        <a href={`/home/${title.question_id}`}>
                          <div className="FaGreaterThan">
                            {title.question_title}
                            <FaGreaterThan className="icon_right" />
                          </div>
                        </a>
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
