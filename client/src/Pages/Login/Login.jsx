import React, { useContext, useRef, useState } from "react";
import axiosBase from "../../axios/AxiosBase";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../Pages/images/bg.png";
import { stateData } from "../../Routing";
import "./Login.css";
import Loader from "../../Component/Loader/Loader";
function Login() {
  const { setUser } = useContext(stateData);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loader, setloader] = useState(false);
  async function handler(e) {
    e.preventDefault();
    try {
      setloader(true);
      const emailValue = emailRef.current.value;
      const passwordValue = passwordRef.current.value;

      const { data } = await axiosBase.post("users/login", {
        email: emailValue,
        password: passwordValue,
      });

      localStorage.setItem("token", data.token);

      setUser({ username: data.username, email: emailValue });

      navigate("/home");
      setloader(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors(error.response.data.message);
      } else {
        setErrors("An error occurred while submitting the form");
      }
      setloader(false);
    }
  }

  return (
    <>
   
      <div style={{ marginBottom: "50px" }}>
        <section
          style={{
            backgroundImage: `url(${bgImage})`,
          }}
          className=" login_container"
        >
          <section className="cssanimation login">
            <div className="join_login">
              {errors && (
                <p
                  className="error-messages"
                  style={{ color: "red", fontSize: "30px" }}
                >
                  {errors}
                </p>
              )}
              <h2>Login in to your account</h2>
              <p>
                Don't have an account?
                <Link to="/"> Create new account</Link>
              </p>
            </div>

            <form onSubmit={handler} action="">
              <div className="inputAddress_login">
                <div>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="Enter Email "
                  />
                </div>
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Enter Password "
                />
                <div className="join123">
                  <a href="/login">
                    <p>Forget Your Password?</p>
                  </a>
                </div>
                <button
                  type="submit"
                  style={{ width: "100%" }}
                  className="button_submit"
                >
                  {loader ? <Loader /> : "Log in "}
                </button>
              </div>
            </form>
          </section>
          <div className="info-container_login">
            <h2>About</h2>
            <h1>Evangadi Networks</h1>
            <p>
              No matter what stage of life you are in, whether you’re just
              starting elementary <br /> school or being promoted to CEO of a
              Fortune 500 company, you have much <br /> to offer to those who
              are trying to follow in your footsteps.
            </p>
            <p>
              Whether you are willing to share your knowledge or you are just
              looking to <br /> meet mentors of your own, please start by
              joining the network here.
            </p>
            <button>
              <Link to={"/home"}>How it Works</Link>
            </button>
          </div>
        </section>
      </div>
    
    </>
  );
}

export default Login;
