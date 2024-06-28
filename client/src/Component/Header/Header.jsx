import React, { useContext } from "react";
import logo from "../../Images/evlogo.png";
import "./Header.css";
import { stateData } from "../../Routing";
import { Link } from "react-router-dom";

function Header() {
  const { user, logout } = useContext(stateData);

  return (
    <section className="header_container">
      <div className="header">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="home_container_signin">
          <Link to="/home">Home</Link>
          <Link to="/home">How it works</Link>
          <div className="sign-in-button">
            {user ? (
              <button className="logout" onClick={logout}>
                Log out
              </button>
            ) : (
              <button>
                <Link to="/login">SIGN IN</Link>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Header;
