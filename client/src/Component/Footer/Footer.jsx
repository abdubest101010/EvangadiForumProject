import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import evangadiLogo from "../../Images/evangadi-logo.PNG";
import { FaYoutube } from "react-icons/fa6";

function Footer() {
  return (
    <section className="footer_container">
      <section className="footers">
        <section className="footer_logo">
          <a href="/">
            <img src={evangadiLogo} alt="" />
          </a>
          <div className="logo_container">
            <a href="/">
              <FaFacebookF color="white" />
            </a>
            <a href="/">
              <FaInstagram color="white" />
            </a>
            <a href="/">
              <FaYoutube color="white" />
            </a>
          </div>
        </section>
        <div className="Useful">
          <p>Useful Links</p>
          <div className="terms_of_privacy">
            <a href="/">Terms of services </a>
            <a href="/">Privacy Policy</a>
          </div>
        </div>
        <div className="contact_info">
          <p className="whitecolour"> contact info</p>
          <div>support@evangadi.com</div>
          <div>+1-202-386-2702</div>
        </div>
      </section>
    </section>
  );
}

export default Footer;
