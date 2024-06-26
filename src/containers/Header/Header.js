import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import { withRouter } from "react-router";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [],
    };
  }
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  handleChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
      this.setState({
        menuApp: menu,
      });
    }
  }
  render() {
    const { processLogout, language, userInfo } = this.props;
    console.log("check user", userInfo);

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
          <button className="btn btn-info" onClick={this.returnToHome}>
            Booking Care
          </button>
        </div>
        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="home-header.welcome" />
            {userInfo && userInfo.firstName ? userInfo.firstName : ""} !
          </span>
          <span
            className={
              language === LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
          >
            VI
          </span>
          <span
            className={
              language === LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
          >
            EN
          </span>{" "}
          {/* nút logout */}
          <div
            className="btn btn-logout"
            onClick={processLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
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
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
