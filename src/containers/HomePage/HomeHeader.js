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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class HomeHeader extends Component {
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  handleSearchComponent = () => {
    this.props.history.push(`/search`);
  };
  render() {
    let language = this.props.language;
    console.log("check user", this.props.userInfo);
    let placeholdertest = (
      <FormattedMessage id="home-header.placeholderInput" />
    );
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
                  <Dropdown.Item href="#">Trang chủ</Dropdown.Item>
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
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.speciality" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.search-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.health-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.select-room" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.doctor" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.select-doctor" />
                </div>
              </div>
              <div className="child-content">
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
              <div className="support">
                <i className="fa fa-question"></i>{" "}
                <FormattedMessage id="home-header.support" />
              </div>
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
              <div className="search" onClick={this.handleSearchComponent}>
                <i className="fas fa-search"></i>

                <input type="search" placeholder={"search something"} />
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div className="icon-child">
                    <i class="fa fa-hospital"></i>
                  </div>
                  <div className="text-child">Khám chuyên khoa</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa fa-phone"></i>
                  </div>
                  <div className="text-child">Khám từ xa</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa fa-bed-pulse"></i>
                  </div>
                  <div className="text-child">Khám tổng quát</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa fa-microscope"></i>
                  </div>
                  <div className="text-child">Xét nghiệm y học</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa fa-person"></i>
                  </div>
                  <div className="text-child">Sức khỏe tinh thần</div>
                </div>
                <div className="option-child">
                  <div className="icon-child">
                    <i className="fa fa-tooth"></i>
                  </div>
                  <div className="text-child">Khám nha khoa</div>
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
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
