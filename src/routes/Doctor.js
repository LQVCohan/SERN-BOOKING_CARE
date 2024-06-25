import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import Header from "../containers/Header/Header";

import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import ManagePatient from "../containers/System/Doctor/ManagePatient";
import ManageDoctorInfo from "../containers/System/Doctor/ManageDoctorInfo";
import BookingHistory from "../containers/System/History/BookingHistory";

class Doctor extends Component {
  render() {
    const { isLoggedIn } = this.props;
    return (
      <React.Fragment>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route
                path={"/doctor/manage-schedule"}
                component={ManageSchedule}
              />
              <Route
                path={"/doctor/manage-patient"}
                component={ManagePatient}
              />
              <Route
                path={"/doctor/manage-doctor-info"}
                component={ManageDoctorInfo}
              />
              <Route
                path={"/doctor/manage-doctor-history"}
                component={BookingHistory}
              />
            </Switch>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
