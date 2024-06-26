import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/appActions";
import { last } from "lodash";
import { lang } from "moment/moment";
import { withRouter } from "react-router";
import Dropdown from "react-bootstrap/Dropdown";

import * as actions from "../../store/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faPhone,
  faBed,
  faMicroscope,
  faUser,
  faTooth,
} from "@fortawesome/free-solid-svg-icons";

class HomeHeader extends Component {
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  handleLogin = () => {
    if (this.props.history) {
      this.props.history.push(`/login`);
    }
  };
  handleSearchComponent = (type) => {
    this.props.history.push(`/search/${type}`);
  };
  handleLogout = () => {
    this.props.processLogout();
    window.location.reload();
  };
  handleViewAllBooking = (patientId) => {
    this.props.history.push(`/patient-booking/${patientId.id}`);
  };
  rule = () => {
    this.props.history.push(`/rule/`);
  };
  render() {
    let language = this.props.language;
    let { isLoggedIn, userInfo } = this.props;
    console.log("check userInfo", userInfo);

    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <Dropdown className="d-inline mx-2" autoClose="inside">
                <Dropdown.Toggle id="dropdown-autoclose-inside" variant="none">
                  <i className="fa fa-bars"> </i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.returnToHome}>
                    Trang chủ
                  </Dropdown.Item>
                  <Dropdown.Item href="#">Cẩm nang</Dropdown.Item>
                  <Dropdown.Item href="#">Liên hệ</Dropdown.Item>
                  <Dropdown.Item href="#">Điều khoảng sử dụng</Dropdown.Item>
                  <Dropdown.Item href="#">
                    <div className="icon">
                      {" "}
                      <div className="fb">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="30"
                          width="30"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="#74C0FC"
                            d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                          />
                        </svg>
                      </div>
                      <div className="mail">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="30"
                          width="30"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="#ff0000"
                            d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                          />
                        </svg>
                      </div>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div className="header-logo" onClick={this.returnToHome}></div>
            </div>
            <div className="center-content">
              <div
                className="child-content"
                onClick={() => this.handleSearchComponent("Specialty")}
              >
                <div>
                  <b>
                    <FormattedMessage id="home-header.speciality" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.search-doctor" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleSearchComponent("Clinic")}
              >
                <div>
                  <b>
                    <FormattedMessage id="home-header.health-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.select-room" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleSearchComponent("Doctor")}
              >
                <div>
                  <b>
                    <FormattedMessage id="home-header.doctor" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.select-doctor" />
                </div>
              </div>
              <div
                className="child-content"
                onClick={() => this.handleSearchComponent("All")}
              >
                <div>
                  <b>
                    <FormattedMessage id="home-header.fee" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.check-health" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support" onClick={this.rule}>
                <i className="fa fa-question"></i>{" "}
                <FormattedMessage id="home-header.support" />
              </div>

              {isLoggedIn && isLoggedIn === true ? (
                <div className="profile">
                  <Dropdown className="d-inline mx-2" autoClose="inside">
                    <Dropdown.Toggle
                      id="dropdown-autoclose-inside"
                      variant="none"
                    >
                      <div
                        className="image"
                        style={{
                          backgroundImage: `url(${userInfo.image})`,
                        }}
                      ></div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/patient-profile/">
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => this.handleViewAllBooking(userInfo)}
                      >
                        Appointment
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        Health Care Package
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <div
                    className="btn btn-logout mr-3"
                    onClick={this.handleLogout}
                    title="Log out"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </div>
                </div>
              ) : (
                <div
                  className="btn login"
                  onClick={this.handleLogin}
                  // onClick={processLogout}
                  title="Log out"
                >
                  <span className="login-label">
                    <FormattedMessage id="home-header.login" />
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    class="bi bi-person"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                </div>
              )}
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                  VI
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="home-header.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="home-header.title2" />
              </div>
              <div
                className="search"
                onClick={() => this.handleSearchComponent("All")}
              >
                <i className="fas fa-search"></i>

                <input type="search" placeholder={"search something"} />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <FontAwesomeIcon icon={faHospital} />
                  </div>
                  <div className="text-child">
                    {language === LANGUAGES.VI
                      ? "Khám chuyên khoa"
                      : "Specialty Examination"}
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div className="text-child">
                    {language === LANGUAGES.VI
                      ? "Khám từ xa"
                      : "Remote Consultation"}
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <FontAwesomeIcon icon={faBed} />
                  </div>
                  <div className="text-child">
                    {language === LANGUAGES.VI
                      ? "Khám tổng quát"
                      : "General Check-up"}
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <FontAwesomeIcon icon={faMicroscope} />
                  </div>
                  <div className="text-child">
                    {language === LANGUAGES.VI
                      ? "Xét nghiệm y học"
                      : "Medical Testing"}
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="text-child">
                    {language === LANGUAGES.VI
                      ? "Sức khỏe tinh thần"
                      : "Mental Health"}
                  </div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <FontAwesomeIcon icon={faTooth} />
                  </div>
                  <div className="text-child">
                    {language === LANGUAGES.VI
                      ? "Khám nha khoa"
                      : "Dental Examination"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
