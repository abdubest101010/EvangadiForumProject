import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import SharedLayout from "./Shared/SharedLayout";
import axiosBase from "./axios/AxiosBase";
import AskQuestion from "./Pages/AskQuestion/AskQuestion";

import PostAnswer from "../src/Pages/postAnswer/postAnswer";

export const stateData = createContext();

function Routing() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.setItem("token", "");

        return;
      }

      try {
        const { data } = await axiosBase.get("/users/check", {
          headers: {
            Authorization: `Bearer ` + token,
          },
        });
        setUser(data);
      } catch (error) {
        console.log(error.response);
        localStorage.removeItem("token");
      }
    }

    checkUser();
  }, [navigate]);

  const logout = () => {
    setUser(null);
    localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <stateData.Provider value={{ user, setUser, logout }}>
      <Routes>
        <Route element={<SharedLayout />}>
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={user ? <Navigate to="/home" /> : <Register />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/askquestion"
            element={user ? <AskQuestion /> : <Login />}
          />
          <Route
            path="/home/:questionId"
            element={user ? <PostAnswer /> : <Login />}
          />
        </Route>
      </Routes>
    </stateData.Provider>
  );
}

export default Routing;
