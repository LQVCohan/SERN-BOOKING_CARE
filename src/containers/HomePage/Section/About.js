import React, { Component } from "react";
import { connect } from "react-redux";

import { FormattedMessage } from "react-intl";
import "./About.scss";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          Thông tin về Đỗ Quang Lâm và Lê Quốc Việt
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <div className="person-info">
              <h2>Đỗ Quang Lâm</h2>
              <img
                src="https://scontent.fsgn6-1.fna.fbcdn.net/v/t39.30808-1/426501820_1498590704034500_4089464347755386026_n.jpg?stp=dst-jpg_p200x200&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeESDvj_R4wxAf4sXejvb43ZyGbsZmJAGFDIZuxmYkAYUIaOvfaUpWxT4WHVKz6W2fRJ5GJ13UA2x5gh1kYvyiN2&_nc_ohc=yUmVIWFQmQAQ7kNvgFIpnZy&_nc_ht=scontent.fsgn6-1.fna&oh=00_AYCxXnh0XjyVmQUyujwVkFHZy2Kw2kZZKQ7HMgnp7rgsXw&oe=666FAAB7"
                alt="Đỗ Quang Lâm"
              />

              <p>{/* Nội dung về Đỗ Quang Lâm */}</p>
            </div>
          </div>
          <div className="content-right">
            <div className="person-info">
              <h2>Lê Quốc Việt</h2>
              <img
                src="https://scontent.fsgn6-1.fna.fbcdn.net/v/t39.30808-1/381459698_1978340599200801_6049860691134298836_n.jpg?stp=dst-jpg_p200x200&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH8SK0065JhfCXCPAHQjx973YPSuSnxNtrdg9K5KfE22hY-nt-9Xct3X4zoako828SiLLIQs-HwUQwgswifnQCP&_nc_ohc=OGDhMW_3QokQ7kNvgF5cJIb&_nc_ht=scontent.fsgn6-1.fna&oh=00_AYCyp598_fFO0cImgPdQ6FBGVO-B3j07b9hQZsVYd4Euww&oe=666FBDC6"
                alt="Lê Quốc Việt"
              />
              <p>{/* Nội dung về Lê Quốc Việt */}</p>
            </div>
          </div>
        </div>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
