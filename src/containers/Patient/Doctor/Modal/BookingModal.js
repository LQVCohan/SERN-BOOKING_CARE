import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import Select from "react-select";
import { Modal } from "reactstrap";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import ProfileDoctor from "../ProfileDoctor";
import { data } from "browserslist";
import _, { times } from "lodash";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { lang } from "moment";
import { LANGUAGES } from "../../../../utils";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import moment from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birth: "",
      genders: "",
      doctorId: "",
      selectedGender: "",
      timeType: "",
    };
  }
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (prevProps.genders !== this.props.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (this.props.dataTime !== prevProps.dataTime) {
      console.log("Datatime laf gif: ", this.props.dataTime);
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        this.setState({
          doctorId: doctorId,
          timeType: timeType,
        });
      }
    }
  }
  async componentDidMount() {
    this.props.getGenderStart();
  }
  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };
  handleOnChangeDatePicker = (date) => {
    this.setState({
      birth: date[0],
    });
  };
  handleChangeSelect = (selectedGender) => {
    this.setState({ selectedGender: selectedGender });
  };
  handleConfirmBooking = async () => {
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);
    let date = new Date(this.state.birth).getTime();
    let res = await postPatientBookAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: date,
      doctorId: this.state.doctorId,
      selectedGender: this.state.selectedGender.value,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
    });
    if (res && res.errCode === 0) {
      toast.success("OK");
      this.props.closeBookingModal();
    } else {
      toast.error("Error");
    }
  };
  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `${time} - ${date}`;
    }
    return "";
  };
  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
      return `${name}`;
    }
    return "";
  };
  render() {
    console.log("Check state inside modal: ", this.state);
    let { dataTime, isOpenModal, closeBookingModal } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }

    return (
      <div>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="lg"
          centered
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="header-left">
                {" "}
                <FormattedMessage id={"patient.booking-modal.label"} />
              </span>
              <span className="header-right" onClick={closeBookingModal}>
                <i className="fas fa-times"> </i>
              </span>
            </div>
            <div className="booking-modal-body">
              <div className="doctor-info">
                <ProfileDoctor
                  doctorId={doctorId}
                  isShowDesDotor={false}
                  dataTime={dataTime}
                />
              </div>
              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.name"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.fullName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "fullName")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage
                      id={"patient.booking-modal.phoneNumber"}
                    />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "phoneNumber")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "email")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.address"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "address")
                    }
                  />
                </div>
                <div className="col-12 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.reason"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.reason}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "reason")
                    }
                  />
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage
                      id={"patient.booking-modal.dateOfBirth"}
                    />
                  </label>
                  <DatePicker
                    className="form-control"
                    onChange={this.handleOnChangeDatePicker}
                    value={this.state.birth}
                  />{" "}
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.gender"} />
                  </label>
                  <Select
                    value={this.state.selectedGender}
                    onChange={this.handleChangeSelect}
                    options={this.state.genders}
                  />{" "}
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              <button
                className="btn-booking-confirm"
                onClick={() => this.handleConfirmBooking()}
              >
                <FormattedMessage id={"patient.booking-modal.confirm"} />
              </button>{" "}
              <button
                className="btn-booking-cancel"
                onClick={closeBookingModal}
              >
                <FormattedMessage id={"patient.booking-modal.cancel"} />
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
