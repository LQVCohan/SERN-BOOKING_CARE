// src/HomeFooter.js
import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

class HomeFooter extends Component {
  render() {
    return (
      <footer className="home-footer">
        <div className="footer-main">
          <div className="footer-column">
            <h3>Bookingcare - Uy tín - Chất lượng</h3>
            <p>Address: Số 1, Võ Văn Ngân</p>
            <p>Phone: 0364821047</p>
            <p>Email: vietle632@gmail.com</p>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/quocviet6028/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="mailto:vietle632@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGoogle} />
              </a>
              <a
                href="https://github.com/LQVCohan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Tiểu luận chuyên ngành</h3>
            <p>Lê Quốc Việt - 20110600</p>
            <p>Đỗ Quang Lâm - 20110512</p>
          </div>
          <div className="footer-column">
            <h3>Create Account</h3>
            <form className="signup-form">
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <input type="password" placeholder="Re-enter Password" required />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2024 Bookingcare website. More information, please visit my
            facebook.
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.facebook.com/quocviet6028/"
            >
              &#8594; Click here &#8592;
            </a>
          </p>
        </div>
      </footer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
