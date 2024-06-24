import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosBase from "../../axios/AxiosBase";

function UserCheck({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function checkUser() {
      try {
        // const { data } = await axiosBase.get("/users/check", {
        //   headers: {
        //     Authorization: "Bearer " + token,
        //   },
        // });
        // setUser(data);
      } catch (error) {
        console.log(error.response);
        navigate("/login");
      }
    }

    if (token) {
      checkUser();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  return user ? children : null;
}

export default UserCheck;
