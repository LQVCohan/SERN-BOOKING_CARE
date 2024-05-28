import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DoctorSchedule.scss";
import {
  getDetailInfoDoctor,
  getScheduleByDateAndDoctor,
} from "../../../services/userService";
import { lang } from "moment";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import moment from "moment";
import BookingModal from "./Modal/BookingModal";
import localization from "moment/locale/vi";
import { FormattedMessage } from "react-intl";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvalTime: [],
      isOpenModalBooking: false,
      dataScheduleTimeModal: [],
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDay(this.props.language);
      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDay(this.props.language);
      let res = await getScheduleByDateAndDoctor(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvalTime: res.data ? res.data : [],
      });
    }
  }
  async componentDidMount() {
    let { language } = this.props;
    let arrDays = this.getArrDay(language);
    if (this.props.doctorIdFromParent) {
      let res = await getScheduleByDateAndDoctor(
        this.props.doctorIdFromParent,
        arrDays[0].value
      );
      this.setState({
        allAvalTime: res.data ? res.data : [],
      });
    }
    if (arrDays && arrDays.length > 0) {
      this.setState({
        allDays: arrDays,
      });
    }
  }
  getArrDay = (language) => {
    let arrDate = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          object.label =
            "Hôm nay " +
            moment(new Date()).add(i, "days").format("dddd - DD/MM");
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = this.capitalizeFirstLetter(labelVi);
        }
      } else if (i === 0) {
        object.label =
          "Today " +
          moment(new Date()).add(i, "days").locale("en").format("DD/MM");
      } else {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("en")
          .format("dddd - DD/MM");
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      arrDate.push(object);
    }
    return arrDate;
  };
  handleOnChangeSelect = async (event) => {
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let res = await getScheduleByDateAndDoctor(doctorId, event.target.value);

      if (res && res.errCode === 0) {
        this.setState({
          allAvalTime: res.data ? res.data : [],
        });
      }
      console.log("check allVal: ", this.state.allAvalTime);
    }
  };
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  handleClickScheduleTime = (time) => {
    this.setState({
      isOpenModalBooking: true,
      dataScheduleTimeModal: time,
    });
  };
  closeBookingModal = () => {
    this.setState({
      isOpenModalBooking: false,
    });
  };
  render() {
    let { dataScheduleTimeModal, allDays, allAvalTime, isOpenModalBooking } =
      this.state;
    let { language } = this.props;
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select onChange={(event) => this.handleOnChangeSelect(event)}>
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option value={item.value} key={index}>
                      {item.label}{" "}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt">
                <span>
                  <FormattedMessage id="patient.detail-doctor.schedule" />
                </span>
              </i>
            </div>
            <div className="time-content">
              {allAvalTime && allAvalTime.length > 0 ? (
                <>
                  <div className="time-content-btns">
                    {allAvalTime.map((item, index) => {
                      return (
                        <button
                          key={index}
                          className={
                            language === LANGUAGES.VI ? "btn-vie" : "btn-en"
                          }
                          onClick={() => this.handleClickScheduleTime(item)}
                        >
                          {language === LANGUAGES.VI
                            ? item.timeTypeData.valueVi
                            : item.timeTypeData.valueEn}
                        </button>
                      );
                    })}
                  </div>

                  <div className="book-free">
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />
                      <i className="far fa-hand-point-up"></i>{" "}
                      <FormattedMessage id="patient.detail-doctor.and" />{" "}
                      <FormattedMessage id="patient.detail-doctor.book" />{" "}
                      <FormattedMessage id="patient.detail-doctor.free" />
                    </span>
                  </div>
                </>
              ) : (
                <div className="no-schedule">
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </div>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isOpenModal={isOpenModalBooking}
          closeBookingModal={this.closeBookingModal}
          dataTime={dataScheduleTimeModal}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
