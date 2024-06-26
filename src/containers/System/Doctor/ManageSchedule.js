import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils";
import moment from "moment";
import DatePicker from "../../../components/Input/DatePicker";
import _ from "lodash";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTrash } from "react-icons/fa";
import {
  saveBulkScheduleDoctor,
  getTotalSheduleOfDoctor,
  changeStatusScheduleDoctorByTime,
} from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: new Date(),
      listDoctors: [],
      selectedDoctor: {},
      rangeTime: [],
      timeSlots: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"],
      days: this.generateDays(new Date(), 7),
      totalSchedule: [],
      markedSlots: {},
    };
  }

  markSlot = (timeType, unixDate) => {
    const { markedSlots } = this.state;
    // Chuyển đổi UNIX timestamp từ milliseconds
    const date = new Date(parseInt(unixDate, 10)); // Đảm bảo rằng unixDate là số nguyên
    const formattedDate = moment(date).format("DD/MM/YYYY");

    if (!markedSlots[timeType]) {
      markedSlots[timeType] = {};
    }
    markedSlots[timeType][formattedDate] = "X";
    this.setState({ markedSlots });
  };

  async componentDidMount() {
    try {
      this.props.fetchAllDoctors();
      this.props.fetchAllScheduleTime();

      let { user } = this.props;
      let res = await getTotalSheduleOfDoctor(user.id);
      res.res.rows.forEach((item) => {
        this.markSlot(item.timeType, item.date);
      });
      if (user && user.roleId === "R2") {
        let object = {};
        let labelVi = `${user.lastName} ${user.firstName}`;
        let labelEn = `${user.firstName} ${user.lastName}`;

        object.label = this.props.language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = user.id;
        this.setState({
          selectedDoctor: object,
        });
      }
    } catch (error) {
      return;
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    try {
      let { user, language } = this.props;
      let { selectedDoctor } = this.state;

      if (prevProps.allDoctors !== this.props.allDoctors) {
        let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
        this.setState({
          listDoctors: dataSelect,
        });
      }
      if (prevState.selectedDoctor !== this.state.selectedDoctor) {
        this.setState({
          markedSlots: {},
        });
        let res = await getTotalSheduleOfDoctor(selectedDoctor.value);
        res.res.rows.forEach((item) => {
          this.markSlot(item.timeType, item.date);
        });
      }
      if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
        let data = this.props.allScheduleTime;
        if (data && data.length > 0) {
          data = data.map((item) => ({ ...item, isSelected: false }));
        }
        let res = await getTotalSheduleOfDoctor(user.id);

        this.setState({
          rangeTime: data,
          totalSchedule: res,
        });
      }
      if (prevProps.language !== this.props.language) {
        if (user && user.roleId === "R2") {
          let object = {};
          let labelVi = `${user.lastName} ${user.firstName}`;
          let labelEn = `${user.firstName} ${user.lastName}`;

          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = user.id;
          this.setState({
            selectedDoctor: object,
          });
        }
      }
    } catch (error) {
      return;
    }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName} `;

        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
      return result;
    }
  };

  handleChangeSelect = (chosenDoctor) => {
    this.setState({ selectedDoctor: chosenDoctor });
  };

  handleOnChangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0],
    });
  };

  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({ rangeTime: rangeTime });
    }
  };

  handleSaveSchedule = async () => {
    try {
      let { rangeTime, selectedDoctor, currentDate } = this.state;
      let result = [];
      console.log("check date: ", currentDate, new Date());
      if (
        !currentDate ||
        currentDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)
      ) {
        toast.error("Missing Date");
      } else if (selectedDoctor && _.isEmpty(selectedDoctor)) {
        toast.error("Missing Doctor");
      } else {
        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
          let selectedTime = rangeTime.filter(
            (item) => item.isSelected === true
          );
          if (selectedTime && selectedTime.length > 0) {
            selectedTime = selectedTime.map((time) => {
              let object = {};
              object.doctorId = selectedDoctor.value;
              object.date = formatedDate;
              object.timeType = time.keyMap;
              object.maxNumber = 10;
              object.statusId = "SS1";
              return result.push(object);
            });
          } else {
            toast.error("Invalid Selected Time!");
            return;
          }
        }

        let res = await saveBulkScheduleDoctor({
          arrSchedule: result,
          doctorId: selectedDoctor.value,
          date: formatedDate,
        });

        if (res && res.errCode === 0) {
          toast.success("Save info successfully");
        } else {
          if (res && res.errCode === 2) {
            toast.warn("Full schedule");
          } else {
            toast.warn("Those schedules already exist!");
          }
        }
      }
    } catch (error) {
      return;
    }
  };

  generateDays(startDate, numDays) {
    const days = [];
    for (let i = 0; i < numDays; i++) {
      let date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }

  isDateInNextWeekOrLater = (date) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date >= nextWeek;
  };

  handleDeleteSchedule = async (timeType, formattedDate) => {
    let { markedSlots, selectedDoctor } = this.state;
    let doctorId = selectedDoctor.value;
    let date = moment(formattedDate, "DD/MM/YYYY").valueOf();
    let statusId = "SS3";
    let res = await changeStatusScheduleDoctorByTime({
      doctorId,
      timeType,
      date,
      statusId,
    });
    if (res && res.errCode === 0) {
      if (markedSlots[timeType] && markedSlots[timeType][formattedDate]) {
        delete markedSlots[timeType][formattedDate];
        if (Object.keys(markedSlots[timeType]).length === 0) {
          delete markedSlots[timeType];
        }
      }
      this.setState({ markedSlots });
      toast.success("Deleted schedule successfully");
    }
    if (res && res.errCode === 3) {
      toast.error("This schedule was booked");
    }
  };

  render() {
    let { rangeTime, timeSlots, days, markedSlots } = this.state;
    let { language, user } = this.props;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    let yesterday = new Date(new Date().setDate(new Date().getDate()) - 1);

    return (
      <div className="manage-schedule-container">
        <div className="manage-schedule-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <Select
                value={this.state.selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
                isDisabled={user && user.roleId === "R2" ? true : false}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnChangeDatePicker}
                minDate={yesterday}
                maxDate={nextWeek}
                value={this.state.currentDate}
                calendarProps={{
                  children: ({ date }) => {
                    const disabled =
                      this.isDateInNextWeekOrLater(date) &&
                      date.getTime() !== nextWeek.getTime();
                    return (
                      <button
                        className={`react-calendar__tile ${
                          disabled ? "react-calendar__tile--disabled" : ""
                        }`}
                        disabled={disabled}
                      >
                        {date.getDate()}
                      </button>
                    );
                  },
                }}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
          <div className="schedule-table-container">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Time Slots</th>
                  {days.map((day, index) => (
                    <th key={index}>{moment(day).format("DD/MM/YYYY")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, index) => (
                  <tr key={index}>
                    <td>
                      {slot === "T1"
                        ? "8:00 - 9:00"
                        : slot === "T2"
                        ? "9:00 - 10:00"
                        : slot === "T3"
                        ? "10:00 - 11:00"
                        : slot === "T4"
                        ? "11:00 - 12:00"
                        : slot === "T5"
                        ? "13:00 - 14:00"
                        : slot === "T6"
                        ? "14:00 - 15:00"
                        : slot === "T7"
                        ? "15:00 - 16:00"
                        : "16:00 - 17:00"}
                    </td>
                    {days.map((day, dayIndex) => (
                      <td key={dayIndex}>
                        {markedSlots[slot] &&
                        markedSlots[slot][moment(day).format("DD/MM/YYYY")] ? (
                          <>
                            <FaCheckCircle color="green" />
                            <button
                              className="btn-delete-schedule"
                              onClick={() =>
                                this.handleDeleteSchedule(
                                  slot,
                                  moment(day).format("DD/MM/YYYY")
                                )
                              }
                            >
                              <FaTrash color="red" />
                            </button>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
