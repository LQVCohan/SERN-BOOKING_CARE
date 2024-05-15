import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/appActions";
import { last } from "lodash";
import { lang } from "moment/moment";
import { withRouter } from "react-router";

class HomeHeader extends Component {
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
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
              <i className="fa fa-bars"></i>
              <div className="header-logo" onClick={this.returnToHome}>
                {" "}
              </div>
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
              <div className="search">
                <i className="fas fa-search"></i>

                <input type="text" placeholder={placeholdertest} />
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
