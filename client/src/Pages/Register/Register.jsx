import React, { useRef, useState } from "react";
import axiosBase from "../../axios/AxiosBase";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../Pages/images/bg.png";
import "./Register.css";
import Loader from "../../Component/Loader/Loader";

function Register() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const [loader, setloader] = useState(false);
  async function handler(e) {
    e.preventDefault();
    try {
      setloader(true);
      const firstNameValue = firstNameRef.current.value;
      const lastNameValue = lastNameRef.current.value;
      const userNameValue = userNameRef.current.value;
      const emailValue = emailRef.current.value;
      const passwordValue = passwordRef.current.value;
      const dataInsert = await axiosBase.post("/users", {
        firstName: firstNameValue,
        lastName: lastNameValue,
        email: emailValue,
        username: userNameValue,
        password: passwordValue,
      });
      console.log("Form submitted successfully", dataInsert);
      navigate("/login");
      setloader(false);
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
      setErrors(error.response.data.msg);
      console.log(error);
      setloader(false);
    }
  }

  return (
    <div>
      <section
        style={{ backgroundImage: `url(${bgImage})` }}
        className="register_container"
      >
        <section className="register">
          <div className="join">
            {errors && (
              <p
                className="error-message"
                style={{ color: "red", fontSize: "30px" }}
              >
                {errors}
              </p>
            )}
            <h2>Join the network</h2>
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
          <form onSubmit={handler}>
            <div className="inputAddress">
              <div>
                <input ref={emailRef} type="email" placeholder="Enter Email" />
              </div>
              <div className="name">
                <input
                  ref={firstNameRef}
                  className="form_input input_1"
                  type="text"
                  placeholder="Enter First Name"
                />
                <input
                  ref={lastNameRef}
                  className="form_input input_2"
                  type="text"
                  placeholder="Enter Last Name"
                />
              </div>
              <div>
                <input
                  ref={userNameRef}
                  type="text"
                  placeholder="Enter User Name"
                />
              </div>
              <input
                ref={passwordRef}
                type="password"
                placeholder="Enter Password"
              />
              <button
                type="submit"
                className="button_submit"
                style={{ width: "100%" }}
              >
                {loader ? <Loader /> : "Agree and join"}
              </button>
              <div className="join">
                <small>
                  I agree to the <Link to="/">privacy policy</Link> and{" "}
                  <Link to="/">terms of services</Link>
                </small>
              </div>
            </div>
          </form>
          <div className="join">
            <Link to="/login">
              <p>Already have an account?</p>
            </Link>
          </div>
        </section>
        <div className="info-container">
          <h2>About</h2>
          <h1>Evangadi Networks</h1>
          <p>
            No matter what stage of life you are in, whether you’re just
            starting elementary <br />
            school or being promoted to CEO of a Fortune 500 company, you have
            much <br /> to offer to those who are trying to follow in your
            footsteps.
          </p>
          <p>
            Whether you are willing to share your knowledge or you are just
            looking to <br /> meet mentors of your own, please start by joining
            the network here.
          </p>
          <button>
            <Link to={"/home"}>How it Works</Link>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Register;
